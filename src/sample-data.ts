
import { DocumentData } from './types/camera';

// Function to generate random date within the last year
const randomDate = () => {
  const now = new Date();
  const pastDate = new Date(
    now.getFullYear() - 1, 
    Math.floor(Math.random() * 12), 
    Math.floor(Math.random() * 28) + 1
  );
  const randomDate = new Date(
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())
  );
  return randomDate.toISOString().split('T')[0];
};

// Generate placeholder image data URL (gray square with text)
const generatePlaceholderImage = (text: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Fill background
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  return canvas.toDataURL('image/jpeg', 0.7);
};

// Generate sample documents
export const generateSampleDocuments = (): DocumentData[] => {
  const documentTypes = [
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
  
  const viewingTags = [
    'Inspected',
    'Reviewed',
    'Approved',
    'Rejected',
    'Pending',
    'Flagged',
    'Confidential'
  ];
  
  const sampleDocuments: DocumentData[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const name = `Sample ${docType} ${i}`;
    const date = randomDate();
    const priority = Math.floor(Math.random() * 10) + 1;
    const viewingTag = Math.random() > 0.3 ? viewingTags[Math.floor(Math.random() * viewingTags.length)] : undefined;
    const numImages = Math.floor(Math.random() * 2) + 1; // 1 or 2 images
    
    const images = [];
    for (let j = 0; j < numImages; j++) {
      images.push(generatePlaceholderImage(`${name} - Image ${j + 1}`));
    }
    
    sampleDocuments.push({
      name,
      date,
      type: docType,
      priority,
      notes: `This is a sample ${docType.toLowerCase()} document for testing purposes. It has a priority of ${priority}/10.`,
      viewingTag,
      images
    });
  }
  
  return sampleDocuments;
};
