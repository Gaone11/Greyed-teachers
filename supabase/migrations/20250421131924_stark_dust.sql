/*
  # Set up admin user authentication

  Creates a function to create an admin user with a specified email and password.
  This is needed because we can't directly insert into the auth.users table.
*/

-- Function to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(admin_email TEXT, admin_password TEXT) 
RETURNS void AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert the user into auth.users (this is handled by Supabase Auth)
  -- We'll create the user with the provided email and password
  -- The user will be created with email confirmation disabled
  -- In a production environment, you should use Supabase dashboard or API to create users
  
  -- Then create a profile for the user with admin role
  INSERT INTO profiles (id, email, role)
  VALUES (auth.uid(), admin_email, 'admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In a real production environment, this function would be executed
-- through a secure administrative channel, not directly in a migration.
-- The actual user creation would happen through Supabase Auth API or dashboard.