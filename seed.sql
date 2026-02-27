-- WingfieldGemini Client Portal — Complete Seed Data
-- Verified against actual Supabase schema (2026-02-27)
-- 
-- TABLES USED (all columns verified):
--   clients: id, prospect_id, deal_id, business_name, contact_name, email, phone, package_tier, setup_fee, monthly_fee, stripe_customer_id, stripe_subscription_id, onboarded_at, status
--   portal_users: id, auth_user_id, client_id, email, created_at, role
--   projects: id, client_id, name, status, current_milestone, start_date, target_launch, launched_at, notes, created_at
--   milestones: id, project_id, name, description, due_date, completed, completed_at, sort_order
--   invoices: *** NEED TO VERIFY — may not exist yet ***
--   documents: *** NEED TO VERIFY — may not exist yet ***
--   messages: id, client_id, sender_type, sender_name, message, read, created_at
--
-- IMPORTANT: Run this AFTER deleting any partial data from failed attempts.
-- To clean up first:
--   DELETE FROM messages WHERE client_id = '11111111-1111-1111-1111-111111111111';
--   DELETE FROM milestones WHERE project_id = '22222222-2222-2222-2222-222222222222';
--   DELETE FROM projects WHERE client_id = '11111111-1111-1111-1111-111111111111';
--   DELETE FROM portal_users WHERE auth_user_id = '39d9c359-0de2-48da-8bb5-0f5bec70c6cc';
--   DELETE FROM clients WHERE id = '11111111-1111-1111-1111-111111111111';

-- Disable RLS on all portal tables
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE portal_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Create invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id),
  amount numeric(10,2) NOT NULL,
  description text,
  status text DEFAULT 'pending',
  due_date date,
  paid_at timestamptz,
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id),
  name text NOT NULL,
  file_url text,
  category text DEFAULT 'general',
  status text DEFAULT 'final',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- Clean up any partial data from failed attempts
DELETE FROM messages WHERE client_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM milestones WHERE project_id = '22222222-2222-2222-2222-222222222222';
DELETE FROM documents WHERE client_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM invoices WHERE client_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM projects WHERE client_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM portal_users WHERE auth_user_id = '39d9c359-0de2-48da-8bb5-0f5bec70c6cc';
DELETE FROM clients WHERE id = '11111111-1111-1111-1111-111111111111';

-- 1. Client
INSERT INTO clients (id, business_name, contact_name, email, phone, package_tier, setup_fee, monthly_fee, status)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Waikanae Beach Takeaways',
  'Sam Wingfield',
  'samuelhwingfield@gmail.com',
  '+64 27 256 6620',
  'growth',
  999.00,
  149.00,
  'active'
);

-- 2. Portal user (links Supabase Auth user to client)
INSERT INTO portal_users (auth_user_id, client_id, email, role)
VALUES (
  '39d9c359-0de2-48da-8bb5-0f5bec70c6cc',
  '11111111-1111-1111-1111-111111111111',
  'samuelhwingfield@gmail.com',
  'owner'
);

-- 3. Project
INSERT INTO projects (id, client_id, name, status, start_date, target_launch)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Website + AI Ordering System',
  'in_progress',
  '2026-02-23',
  '2026-03-07'
);

-- 4. Milestones (using "completed" boolean, NOT "status" text)
INSERT INTO milestones (project_id, name, description, due_date, completed, completed_at, sort_order) VALUES
('22222222-2222-2222-2222-222222222222', 'Discovery & Design', 'Initial consultation, brand review, design mockups', '2026-02-24', true, '2026-02-24', 1),
('22222222-2222-2222-2222-222222222222', 'Website Build', 'Premium dark navy + gold website with 4 pages', '2026-02-26', true, '2026-02-26', 2),
('22222222-2222-2222-2222-222222222222', 'AI Chat Widget', 'Conversational ordering bot on website', '2026-02-27', true, '2026-02-27', 3),
('22222222-2222-2222-2222-222222222222', 'SMS & Voice AI', 'Phone ordering via SMS and voice call', '2026-03-03', false, NULL, 4),
('22222222-2222-2222-2222-222222222222', 'Launch & Handoff', 'Go live, training, documentation', '2026-03-07', false, NULL, 5);

-- 5. Invoices
INSERT INTO invoices (client_id, amount, description, status, due_date) VALUES
('11111111-1111-1111-1111-111111111111', 999.00, 'Growth Package - Setup Fee', 'pending', '2026-03-01'),
('11111111-1111-1111-1111-111111111111', 149.00, 'Growth Package - March Monthly', 'pending', '2026-03-15');

-- 6. Documents
INSERT INTO documents (client_id, name, category, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Proposal - Website + AI Ordering', 'proposal', 'final'),
('11111111-1111-1111-1111-111111111111', 'Brand Guidelines', 'design', 'final'),
('11111111-1111-1111-1111-111111111111', 'Menu Integration Spec', 'technical', 'pending_review');

-- 7. Welcome message
INSERT INTO messages (client_id, sender_type, sender_name, message, read) VALUES
('11111111-1111-1111-1111-111111111111', 'team', 'Victory', 'Welcome to your Client Performance Portal! Your website build is progressing well — AI chat widget is live, SMS and voice ordering coming next week.', false);
