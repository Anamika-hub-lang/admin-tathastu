export type ProfessionKind = 'doctor' | 'nurse' | 'physio' | 'ambulance' | 'nanny' | 'assistant';

export const professionLabel: Record<ProfessionKind, string> = {
  doctor: 'Doctor',
  nurse: 'Nurse',
  physio: 'Physiotherapist',
  ambulance: 'Ambulance',
  nanny: 'Nanny',
  assistant: 'Nursing assistant',
};
