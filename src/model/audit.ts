import Client from '../database/client';

interface IAudit {
	auditAction: string;
	data: string;
	status: number;
	error: string;
	auditBy: string;
	auditOn: Date;
}

class Audit {}
export default Audit;
