CREATE TABLE audit(
   audit_id SERIAL NOT NULL,
   audit_action VARCHAR(100) NOT NULL,
   audit_data JSON,
   audit_status INTEGER,
   audit_error JSON,
   audit_by VARCHAR(50) NOT NULL,
   audit_on TIMESTAMP,
   CONSTRAINT audit_pkey PRIMARY KEY (audit_id)
);