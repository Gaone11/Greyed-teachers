/*
  # Update subscription status for Start@tony.com
  
  1. Changes
    - Finds the user account with email Start@tony.com
    - Gets or creates the customer_id from stripe_customers for this user
    - Updates or inserts the subscription in stripe_subscriptions to use the Teachers plan price_id
    - Sets the subscription status to 'active'
    - Sets a far future expiration date (one year from now)
    
  2. Security
    - Uses secure PL/pgSQL anonymous block for complex operations
    - Uses variables to safely store and reference IDs
*/

DO $$
DECLARE
    tony_user_id UUID;
    tony_customer_id TEXT;
    customer_exists BOOLEAN;
BEGIN
    -- Find the user ID for Start@tony.com
    SELECT id INTO tony_user_id
    FROM auth.users
    WHERE email = 'Start@tony.com';
    
    -- If the user exists
    IF FOUND THEN
        RAISE NOTICE 'Found user ID % for Start@tony.com', tony_user_id;
        
        -- Check if customer record exists
        SELECT 
            customer_id,
            TRUE INTO tony_customer_id, customer_exists
        FROM stripe_customers
        WHERE user_id = tony_user_id;
        
        -- If no customer record, create one
        IF NOT FOUND OR tony_customer_id IS NULL THEN
            customer_exists := FALSE;
            -- Generate a mock customer ID
            tony_customer_id := 'cus_tony_' || tony_user_id;
            
            -- Insert customer record
            INSERT INTO stripe_customers (
                user_id, 
                customer_id, 
                created_at
            ) VALUES (
                tony_user_id,
                tony_customer_id,
                NOW()
            );
            
            RAISE NOTICE 'Created new customer record with ID % for Start@tony.com', tony_customer_id;
        ELSE
            RAISE NOTICE 'Found existing customer record with ID % for Start@tony.com', tony_customer_id;
        END IF;
        
        -- Calculate subscription dates (1 year)
        DECLARE
            current_period_start BIGINT;
            current_period_end BIGINT;
        BEGIN
            current_period_start := EXTRACT(EPOCH FROM NOW())::bigint;
            -- Set expiration to 1 year from now (365 days)
            current_period_end := EXTRACT(EPOCH FROM (NOW() + INTERVAL '365 days'))::bigint;
            
            -- Check if subscription exists
            DECLARE
                subscription_id TEXT;
                subscription_exists BOOLEAN;
            BEGIN
                SELECT 
                    ss.subscription_id,
                    TRUE INTO subscription_id, subscription_exists
                FROM stripe_subscriptions ss
                WHERE ss.customer_id = tony_customer_id;
                
                -- If no subscription, create one
                IF NOT FOUND THEN
                    subscription_exists := FALSE;
                    -- Generate a mock subscription ID
                    subscription_id := 'sub_tony_' || tony_user_id;
                    
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
                        tony_customer_id,
                        subscription_id,
                        'price_1RUB57KhB7e46jXjQaGUjQU6', -- GreyEd Teachers plan price ID
                        current_period_start,
                        current_period_end,
                        false,
                        'active'::stripe_subscription_status
                    );
                    
                    RAISE NOTICE 'Created new subscription % for Start@tony.com valid until %', 
                        subscription_id, 
                        to_timestamp(current_period_end)::date;
                ELSE
                    -- Update existing subscription
                    UPDATE stripe_subscriptions
                    SET 
                        price_id = 'price_1RUB57KhB7e46jXjQaGUjQU6', -- GreyEd Teachers plan price ID
                        current_period_start = current_period_start,
                        current_period_end = current_period_end,
                        cancel_at_period_end = false,
                        status = 'active'::stripe_subscription_status,
                        updated_at = NOW()
                    WHERE subscription_id = subscription_id;
                    
                    RAISE NOTICE 'Updated subscription % for Start@tony.com valid until %', 
                        subscription_id, 
                        to_timestamp(current_period_end)::date;
                END IF;
                
                -- Ensure teacher preferences are set correctly
                MERGE INTO teacher_preferences AS tp
                USING (SELECT tony_user_id AS id) AS source
                ON tp.teacher_id = source.id
                WHEN MATCHED THEN
                    UPDATE SET 
                        subscription_tier = 'paid',
                        features = '{"assessments": 999, "lesson_plans": 999, "family_updates": 999}'::jsonb,
                        updated_at = NOW()
                WHEN NOT MATCHED THEN
                    INSERT (teacher_id, subscription_tier, features)
                    VALUES (
                        tony_user_id, 
                        'paid', 
                        '{"assessments": 999, "lesson_plans": 999, "family_updates": 999}'::jsonb
                    );
                    
                RAISE NOTICE 'Updated teacher preferences for Start@tony.com';
            END;
        END;
    ELSE
        RAISE NOTICE 'User Start@tony.com not found in the database';
    END IF;
END $$;