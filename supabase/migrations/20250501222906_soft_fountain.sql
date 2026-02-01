/*
  # Update student@greyxgroup.com subscription

  1. Changes
    - Find the user account with email student@greyxgroup.com
    - Get the customer_id from stripe_customers for this user
    - Update the subscription in stripe_subscriptions to use the Premium Student plan price_id
    - Set the subscription status to 'active'

  2. Security
    - Uses secure PL/pgSQL anonymous block for complex operations
    - Uses variables to safely store and reference IDs
*/

DO $$
DECLARE
    student_user_id UUID;
    student_customer_id TEXT;
BEGIN
    -- Find the user ID for student@greyxgroup.com
    SELECT id INTO student_user_id
    FROM auth.users
    WHERE email = 'student@greyxgroup.com';

    -- If the user exists, get their customer ID
    IF FOUND THEN
        SELECT customer_id INTO student_customer_id
        FROM stripe_customers
        WHERE user_id = student_user_id;

        -- If the customer exists, update their subscription
        IF FOUND THEN
            -- Update the subscription with the Premium Student plan price_id
            UPDATE stripe_subscriptions
            SET
                price_id = 'price_premium_student', -- GreyEd Premium Student plan
                status = 'active'::stripe_subscription_status,
                updated_at = NOW()
            WHERE customer_id = student_customer_id;

            -- Log the update for audit purposes
            RAISE NOTICE 'Updated subscription for student@greyxgroup.com (User ID: %, Customer ID: %)',
                student_user_id, student_customer_id;
        ELSE
            RAISE NOTICE 'No customer record found for student@greyxgroup.com (User ID: %)', student_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'User student@greyxgroup.com not found';
    END IF;
END $$;
