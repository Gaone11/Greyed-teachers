DO $$
DECLARE
    tony_user_id UUID;
    tony_customer_id TEXT;
    subscription_id TEXT;
    current_period_start BIGINT;
    current_period_end BIGINT;
BEGIN
    -- Find the user ID for Start@tony.com
    SELECT id INTO tony_user_id
    FROM auth.users
    WHERE email = 'Start@tony.com';
    
    -- If the user exists
    IF FOUND THEN
        -- Get or create customer record
        SELECT customer_id INTO tony_customer_id
        FROM stripe_customers
        WHERE user_id = tony_user_id;
        
        -- If no customer record, create one
        IF NOT FOUND THEN
            tony_customer_id := 'cus_tony_' || tony_user_id;
            
            INSERT INTO stripe_customers (
                user_id, 
                customer_id, 
                created_at
            ) VALUES (
                tony_user_id,
                tony_customer_id,
                NOW()
            );
        END IF;
        
        -- Set subscription dates (1 year)
        current_period_start := EXTRACT(EPOCH FROM NOW())::bigint;
        current_period_end := EXTRACT(EPOCH FROM (NOW() + INTERVAL '365 days'))::bigint;
        
        -- Check if subscription exists
        SELECT subscription_id INTO subscription_id
        FROM stripe_subscriptions
        WHERE customer_id = tony_customer_id;
        
        -- If no subscription, create one
        IF NOT FOUND THEN
            subscription_id := 'sub_tony_' || tony_user_id;
            
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
                'price_1RUB57KhB7e46jXjQaGUjQU6',
                current_period_start,
                current_period_end,
                false,
                'active'::stripe_subscription_status
            );
        ELSE
            -- Update existing subscription
            UPDATE stripe_subscriptions
            SET 
                price_id = 'price_1RUB57KhB7e46jXjQaGUjQU6',
                current_period_start = current_period_start,
                current_period_end = current_period_end,
                cancel_at_period_end = false,
                status = 'active'::stripe_subscription_status,
                updated_at = NOW()
            WHERE subscription_id = subscription_id;
        END IF;
        
        -- Update teacher preferences
        INSERT INTO teacher_preferences (
            teacher_id, 
            subscription_tier, 
            features
        ) VALUES (
            tony_user_id, 
            'paid', 
            '{"assessments": 999, "lesson_plans": 999, "family_updates": 999}'::jsonb
        )
        ON CONFLICT (teacher_id) 
        DO UPDATE SET
            subscription_tier = 'paid',
            features = '{"assessments": 999, "lesson_plans": 999, "family_updates": 999}'::jsonb,
            updated_at = NOW();
    END IF;
END $$;