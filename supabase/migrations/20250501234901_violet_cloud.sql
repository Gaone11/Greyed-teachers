-- Update subscription status for student@greyxgroup.com
DO $$
DECLARE
    student_user_id UUID;
    student_subscription_id TEXT;
BEGIN
    -- Find the user ID for student@greyxgroup.com
    SELECT id INTO student_user_id
    FROM auth.users
    WHERE email = 'student@greyxgroup.com';

    -- If the user exists, update their subscription status
    IF FOUND THEN
        -- Find their subscription
        SELECT subscription_id INTO student_subscription_id
        FROM stripe_subscriptions ss
        JOIN stripe_customers sc ON ss.customer_id = sc.customer_id
        WHERE sc.user_id = student_user_id;

        -- Update the subscription status to active
        IF FOUND THEN
            UPDATE stripe_subscriptions
            SET
                status = 'active',
                price_id = 'price_premium_student',
                current_period_start = EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day'))::bigint,
                current_period_end = EXTRACT(EPOCH FROM (NOW() + INTERVAL '30 days'))::bigint,
                updated_at = NOW()
            WHERE subscription_id = student_subscription_id;

            RAISE NOTICE 'Updated subscription status for student@greyxgroup.com to active';
        ELSE
            RAISE NOTICE 'No subscription found for student@greyxgroup.com';

            -- Find customer ID
            DECLARE
                student_customer_id TEXT;
            BEGIN
                SELECT customer_id INTO student_customer_id
                FROM stripe_customers
                WHERE user_id = student_user_id;

                IF FOUND THEN
                    -- Insert a new subscription record
                    INSERT INTO stripe_subscriptions (
                        customer_id,
                        subscription_id,
                        price_id,
                        current_period_start,
                        current_period_end,
                        cancel_at_period_end,
                        status
                    ) VALUES (
                        student_customer_id,
                        'sub_student_' || student_user_id,
                        'price_premium_student',
                        EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day'))::bigint,
                        EXTRACT(EPOCH FROM (NOW() + INTERVAL '30 days'))::bigint,
                        false,
                        'active'
                    );

                    RAISE NOTICE 'Created new active subscription for student@greyxgroup.com';
                ELSE
                    RAISE NOTICE 'No customer ID found for student@greyxgroup.com';
                END IF;
            END;
        END IF;
    ELSE
        RAISE NOTICE 'User student@greyxgroup.com not found';
    END IF;
END $$;

-- Make sure profiles for students have the correct role
UPDATE profiles
SET
    role = 'student',
    plan = 'premium',
    updated_at = NOW()
WHERE
    id IN (SELECT user_id FROM stripe_customers sc
           JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
           WHERE ss.price_id = 'price_premium_student');

-- Ensure student data retention settings
INSERT INTO student_data_retention (
    student_id,
    chat_retention_days,
    media_retention_days,
    progress_retention_days,
    audit_retention_days,
    analytics_consent,
    ai_training_consent,
    research_consent,
    marketing_consent
)
SELECT
    s.id,
    365,
    180,
    730,
    2555,
    true,
    true,
    false,
    false
FROM
    students s
WHERE
    s.id NOT IN (SELECT student_id FROM student_data_retention)
ON CONFLICT (student_id) DO NOTHING;
