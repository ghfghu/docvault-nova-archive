
// Extended interface for MediaTrackCapabilities to include torch
export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

// Extended interface for MediaTrackConstraintSet to include torch
export interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

// Extended interface for MediaTrackConstraints to include torch
export interface MediaTrackConstraintsWithTorch extends MediaTrackConstraints {
  advanced?: ExtendedMediaTrackConstraintSet[];
}

// Document types
export const documentTypes = [
  'ID Card',
  'Passport',
  'Driver\'s License',
  'Birth Certificate',
  'Invoice',
  'Contract',
  'Medical Record',
  'Evidence',
  'Other'
];

// Viewing tags
export const viewingTags = [
  'Inspected',
  'Reviewed',
  'Approved',
  'Rejected',
  'Pending',
  'Flagged',
  'Confidential'
];

// Document interface
export interface DocumentData {
  name: string;
  date: string;
  type: string;
  priority: number;
  notes: string;
  viewingTag?: string;
  images: string[];
}
