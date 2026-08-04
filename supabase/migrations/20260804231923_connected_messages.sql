/*
  # Connected hub messages

  Stores messages between connected student, teacher, and parent accounts.
  Messages are grouped by a deterministic conversation key derived from the
  connected learning circle and participant pair.
*/

CREATE TABLE IF NOT EXISTS connected_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_key text NOT NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('student', 'teacher', 'parent')),
  sender_name text NOT NULL,
  sender_email text,
  recipient_role text NOT NULL CHECK (recipient_role IN ('student', 'teacher', 'parent')),
  recipient_name text NOT NULL,
  recipient_email text,
  participant_emails text[] NOT NULL DEFAULT '{}',
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE connected_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connected participants can view messages"
  ON connected_messages
  FOR SELECT
  TO authenticated
  USING (
    lower(auth.jwt() ->> 'email') = ANY(participant_emails)
  );

CREATE POLICY "Connected participants can send messages"
  ON connected_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lower(auth.jwt() ->> 'email') = ANY(participant_emails)
  );

CREATE INDEX IF NOT EXISTS connected_messages_conversation_created_idx
  ON connected_messages(conversation_key, created_at);

CREATE INDEX IF NOT EXISTS connected_messages_participants_idx
  ON connected_messages USING gin(participant_emails);
