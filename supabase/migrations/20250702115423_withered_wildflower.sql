/*
  # Add Admin User Migration - Updated Approach

  1. Changes
    - Check for existing admin users in auth and profiles tables
    - Only set up subscriptions for existing users
    - Avoid creating profiles without corresponding auth users
    
  2. Security
    - Uses secure PL/pgSQL anonymous block
    - Handles foreign key constraints properly
*/

DO $$
DECLARE
  admin_user_id UUID;
  admin_customer_id TEXT := 'cus_admin_monti';
  admin_email TEXT := 'monti@greyed.org';
BEGIN
  -- Look for an existing user with this email
  -- We can't directly create users in auth.users from migrations
  -- So we'll only set up subscriptions for existing users
  
  -- First check if a user exists with this email in the auth.users table
  BEGIN
    -- Try to get the user ID by email from auth.users
    -- This might fail depending on permissions, so we use a BEGIN/EXCEPTION block
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF FOUND THEN
      RAISE NOTICE 'Found existing user with email %: %', admin_email, admin_user_id;
    END IF;
  EXCEPTION WHEN others THEN
    -- If we can't query auth.users, we'll try to find the user through profiles
    RAISE NOTICE 'Could not directly query auth.users table: %', SQLERRM;
  END;
  
  -- If we couldn't find the user via auth.users, try through profiles that are linked to users
  IF admin_user_id IS NULL THEN
    -- Look for profiles with admin role or matching name patterns
    SELECT p.id INTO admin_user_id
    FROM profiles p
    WHERE p.role = 'admin' 
       OR p.first_name = 'Admin' 
       OR p.first_name = 'Monti'
    LIMIT 1;
    
    IF FOUND THEN
      RAISE NOTICE 'Found admin user through profiles: %', admin_user_id;
    ELSE
      RAISE NOTICE 'No existing admin user found. Migration will only update existing users.';
      -- Return early since we can't create users in auth.users
      RETURN;
    END IF;
  END IF;
  
  -- Now we have a valid admin_user_id that exists in auth.users
  -- Update the profile if it exists
  IF EXISTS (SELECT 1 FROM profiles WHERE id = admin_user_id) THEN
    UPDATE profiles
    SET 
      role = 'admin',
      plan = 'premium',
      updated_at = NOW()
    WHERE id = admin_user_id;

    RAISE NOTICE 'Updated existing profile for user ID: %', admin_user_id;
  END IF;

  -- Ensure the admin user has a customer record in stripe_customers
  IF NOT EXISTS (
    SELECT 1 FROM stripe_customers 
    WHERE user_id = admin_user_id
  ) THEN
    -- Insert customer record
    INSERT INTO stripe_customers (
      user_id,
      customer_id,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      admin_customer_id,
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Created stripe customer record for admin user';
  ELSE
    -- Update existing customer record
    UPDATE stripe_customers
    SET 
      customer_id = admin_customer_id,
      updated_at = NOW()
    WHERE user_id = admin_user_id;
    
    RAISE NOTICE 'Updated existing customer record for admin user';
  END IF;

  -- Get the current customer_id for the admin user
  SELECT customer_id INTO admin_customer_id
  FROM stripe_customers
  WHERE user_id = admin_user_id;

  -- Ensure the admin user has an active subscription
  IF NOT EXISTS (
    SELECT 1 FROM stripe_subscriptions
    WHERE customer_id = admin_customer_id
  ) THEN
    -- Insert subscription record
    INSERT INTO stripe_subscriptions (
      customer_id,
      subscription_id,
      price_id,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      status
    ) VALUES (
      admin_customer_id,
      'sub_admin_' || admin_user_id,
      'price_1RUB57KhB7e46jXjQaGUjQU6', -- GreyEd Teachers premium plan
      EXTRACT(EPOCH FROM NOW())::bigint,
      EXTRACT(EPOCH FROM (NOW() + INTERVAL '1 year'))::bigint, -- Valid for a year
      false,
      'active'
    );

    RAISE NOTICE 'Created active subscription for admin user';
  ELSE
    -- Update the subscription to ensure it's active
    UPDATE stripe_subscriptions
    SET 
      status = 'active',
      price_id = 'price_1RUB57KhB7e46jXjQaGUjQU6', -- Ensure correct plan
      current_period_start = EXTRACT(EPOCH FROM NOW())::bigint,
      current_period_end = EXTRACT(EPOCH FROM (NOW() + INTERVAL '1 year'))::bigint,
      updated_at = NOW()
    WHERE customer_id = admin_customer_id;

    RAISE NOTICE 'Updated admin subscription to active status';
  END IF;

  -- Set up teacher preferences for admin user if the user exists
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO teacher_preferences (
      teacher_id,
      subscription_tier,
      features,
      updated_at
    ) VALUES (
      admin_user_id,
      'paid',
      '{"assessments": 999, "lesson_plans": 999, "family_updates": 999}'::jsonb,
      NOW()
    )
    ON CONFLICT (teacher_id)
    DO UPDATE SET
      subscription_tier = 'paid',
      features = '{"assessments": 999, "lesson_plans": 999, "family_updates": 999}'::jsonb,
      updated_at = NOW();

    RAISE NOTICE 'Set up teacher preferences for admin user';
  END IF;
END $$;