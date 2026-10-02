-- Education OS: Quantum Learning Studio seed
-- Idempotent seed for the learning-method and recovery catalog.

insert into public.learning_method_plans
  (code,name,framework,description,evidence_basis,active)
select
  'QL_TANDUR_V2',
  'Quantum Learning Studio',
  'TANDUR-inspired + active learning + retrieval + metacognition',
  'Kerangka sesi yang menggabungkan prinsip TANDUR dengan active learning, retrieval practice, metacognition, adaptive pacing, recovery break, dan evidence loop. Outcome siswa tetap menjadi ukuran utama.',
  jsonb_build_object(
    'source','Quantum Learning / Quantum Teaching literature and Education OS evidence framework',
    'stages',jsonb_build_array('Tumbuhkan','Alami','Namai','Demonstrasikan','Ulangi','Rayakan'),
    'guardrail','Do not infer right-brain/left-brain activation from audio; measure observable outcomes.'
  ),
  true
where not exists (
  select 1 from public.learning_method_plans where code='QL_TANDUR_V2'
);

insert into public.learning_audio_catalog
  (title,audio_type,intended_use,duration_seconds,evidence_note,safety_note,active)
select *
from (values
  ('Nature Soundscape · Rain / Forest','soundscape','Recovery dan transisi perhatian',240,
   'Dapat dibandingkan dengan silent break. Efek terhadap belajar harus diukur per siswa.',
   'Opsional; hentikan jika mengganggu, membuat tidak nyaman, atau meningkatkan kantuk. Bukan terapi medis.',true),
  ('Guided Relaxation · Breathing','breathing','Jeda pemulihan singkat sebelum retrieval atau latihan',180,
   'Intervensi regulasi sederhana; Education OS mencatat respons sebelum dan sesudah.',
   'Bukan hipnoterapi atau terapi medis. Gunakan hanya jika siswa nyaman.',true),
  ('Silent Reset · No Audio','relaxation','Kondisi pembanding tanpa suara',180,
   'Kondisi kontrol membantu membedakan efek jeda dari efek soundscape.',
   'Tidak ada audio; dapat digunakan sebagai jeda tenang atau peregangan ringan.',true)
) as v(title,audio_type,intended_use,duration_seconds,evidence_note,safety_note,active)
where not exists (
  select 1 from public.learning_audio_catalog a where a.title=v.title
);
