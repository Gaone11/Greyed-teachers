/*
  # Revert Teacher Knowledge Base tables

  Drops the tables created by the teacher_knowledge_base migration:
  - `kb_teacher_chunks` (dropped first due to foreign key dependency)
  - `kb_teacher_documents`
*/

DROP TABLE IF EXISTS kb_teacher_chunks;
DROP TABLE IF EXISTS kb_teacher_documents;
