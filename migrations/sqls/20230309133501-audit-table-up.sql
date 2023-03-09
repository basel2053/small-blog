CREATE TABLE audit(
   audit_id SERIAL NOT NULL,
   audit_action varchar(100) NOT NULL,
   audit_data json,
   audit_status integer,
   audit_error json,
   audit_by varchar(50) NOT NULL,
   audit_on timestamp,
   CONSTRAINT audit_pkey PRIMARY KEY (audit_id)
);