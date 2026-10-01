export type EducationRole='Siswa'|'Orang Tua'|'Mentor'|'Institusi'|'Mentor OSN'|'Administrator';
export type Permission='workspace.view'|'profile.view'|'profile.edit'|'student.self.read'|'student.linked.read'|'student.assigned.read'|'student.org.read'|'academic.read'|'academic.manage'|'assessment.read'|'assessment.manage'|'evidence.read'|'evidence.manage'|'finance.read'|'finance.manage'|'crm.read'|'crm.manage'|'osn.read'|'osn.manage'|'governance.read'|'governance.manage'|'audit.read'|'audit.write'|'ai.read'|'ai.manage';

const rolePermissions:Record<EducationRole,Permission[]>={
'Siswa':['workspace.view','profile.view','profile.edit','student.self.read','academic.read','assessment.read','evidence.read','evidence.manage'],
'Orang Tua':['workspace.view','profile.view','profile.edit','student.linked.read','academic.read','assessment.read','evidence.read','finance.read'],
'Mentor':['workspace.view','profile.view','profile.edit','student.assigned.read','academic.read','academic.manage','assessment.read','assessment.manage','evidence.read','evidence.manage'],
'Mentor OSN':['workspace.view','profile.view','profile.edit','student.assigned.read','osn.read','osn.manage','assessment.read','assessment.manage','evidence.read','evidence.manage'],
'Institusi':['workspace.view','profile.view','profile.edit','student.org.read','academic.read','academic.manage','assessment.read','assessment.manage','evidence.read','evidence.manage','finance.read','finance.manage','crm.read','crm.manage','governance.read','governance.manage','audit.read','audit.write'],
'Administrator':['workspace.view','profile.view','profile.edit','student.self.read','student.linked.read','student.assigned.read','student.org.read','academic.read','academic.manage','assessment.read','assessment.manage','evidence.read','evidence.manage','finance.read','finance.manage','crm.read','crm.manage','osn.read','osn.manage','governance.read','governance.manage','audit.read','audit.write','ai.read','ai.manage']
};

export function hasPermission(role:EducationRole,permission:Permission){return rolePermissions[role]?.includes(permission)??false;}
export function scopeLabel(role:EducationRole){switch(role){case'Siswa':return'Data siswa sendiri';case'Orang Tua':return'Data anak yang terhubung';case'Mentor':return'Siswa yang ditugaskan';case'Mentor OSN':return'Peserta pembinaan OSN';case'Institusi':return'Tenant institusi';default:return'Scope administratif sesuai permission';}}
export function scopeRule(role:EducationRole){return role==='Administrator'?'global':role==='Institusi'?'organization':role==='Mentor'||role==='Mentor OSN'?'assigned':role==='Orang Tua'?'linked':'self';}