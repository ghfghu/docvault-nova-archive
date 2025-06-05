
import { DocumentData } from './types/camera';

// Function to generate random date within specified range
const randomDate = (daysBack: number = 365) => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  const randomTime = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Generate placeholder image data URL (gray square with text)
const generatePlaceholderImage = (text: string, color: string = '#333333'): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into multiple lines if too long
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 40 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    // Draw lines
    const lineHeight = 30;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });
    
    // Add timestamp
    ctx.font = '12px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText(new Date().toLocaleString(), canvas.width / 2, canvas.height - 20);
  }
  return canvas.toDataURL('image/jpeg', 0.7);
};

// Comprehensive document types
const documentTypes = [
  'ID Card', 'Passport', 'Driver\'s License', 'Birth Certificate', 'Marriage Certificate',
  'Divorce Decree', 'Social Security Card', 'Visa', 'Work Permit', 'Green Card',
  'Invoice', 'Receipt', 'Contract', 'Agreement', 'Lease', 'Deed', 'Title',
  'Medical Record', 'Prescription', 'Lab Result', 'X-Ray', 'MRI Report',
  'Insurance Policy', 'Claim Form', 'Police Report', 'Court Document',
  'Evidence', 'Witness Statement', 'Affidavit', 'Subpoena', 'Warrant',
  'Tax Return', 'W-2', '1099', 'Bank Statement', 'Credit Report',
  'Academic Transcript', 'Diploma', 'Certificate', 'License', 'Permit',
  'Business License', 'Articles of Incorporation', 'Operating Agreement',
  'Employment Letter', 'Reference Letter', 'Recommendation',
  'Travel Document', 'Ticket', 'Boarding Pass', 'Itinerary',
  'Property Document', 'Utility Bill', 'Phone Bill', 'Internet Bill',
  'Other'
];

const viewingTags = [
  'Inspected', 'Reviewed', 'Approved', 'Rejected', 'Pending', 'Flagged',
  'Confidential', 'Urgent', 'Priority', 'Archived', 'Active', 'Expired',
  'Verified', 'Unverified', 'Incomplete', 'Complete', 'Processing',
  'On Hold', 'Escalated', 'Resolved'
];

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
  'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Stephanie', 'Daniel',
  'Melissa', 'Matthew', 'Nicole', 'Anthony', 'Elizabeth', 'Mark', 'Helen',
  'Donald', 'Deborah', 'Steven', 'Rachel', 'Andrew', 'Carolyn', 'Kenneth',
  'Janet', 'Paul', 'Catherine', 'Joshua', 'Maria', 'Kevin', 'Heather'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King'
];

const companies = [
  'ABC Corporation', 'XYZ Industries', 'Global Solutions Inc', 'Tech Innovations LLC',
  'Metro Medical Center', 'City Hospital', 'First National Bank', 'State Insurance Co',
  'Prime Real Estate', 'Elite Law Firm', 'Supreme Court', 'District Attorney Office',
  'Federal Bureau', 'Immigration Services', 'Department of Motor Vehicles',
  'Social Security Administration', 'Internal Revenue Service', 'State University',
  'Community College', 'Public School District', 'Transportation Authority',
  'Utilities Company', 'Construction Corp', 'Manufacturing Inc', 'Retail Chain'
];

// Generate sample documents with much more variety
export const generateSampleDocuments = (count: number = 50): DocumentData[] => {
  const sampleDocuments: DocumentData[] = [];
  
  for (let i = 1; i <= count; i++) {
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    let name: string;
    let notes: string;
    
    // Generate realistic document names and notes based on type
    switch (docType) {
      case 'ID Card':
      case 'Passport':
      case 'Driver\'s License':
        name = `${docType} - ${firstName} ${lastName}`;
        notes = `Government issued ${docType.toLowerCase()} for ${firstName} ${lastName}. Document number: ${Math.random().toString(36).substr(2, 9).toUpperCase()}.`;
        break;
      case 'Invoice':
      case 'Receipt':
        name = `${docType} #${Math.floor(Math.random() * 100000)} - ${company}`;
        notes = `${docType} from ${company} dated ${randomDate(90)}. Amount: $${(Math.random() * 5000 + 100).toFixed(2)}.`;
        break;
      case 'Medical Record':
      case 'Prescription':
      case 'Lab Result':
        name = `${docType} - ${firstName} ${lastName}`;
        notes = `Medical ${docType.toLowerCase()} for patient ${firstName} ${lastName}. Provider: ${company}. Date of service: ${randomDate(30)}.`;
        break;
      case 'Contract':
      case 'Agreement':
      case 'Lease':
        name = `${docType} - ${firstName} ${lastName} & ${company}`;
        notes = `Legal ${docType.toLowerCase()} between ${firstName} ${lastName} and ${company}. Effective date: ${randomDate(180)}.`;
        break;
      case 'Evidence':
      case 'Police Report':
      case 'Court Document':
        name = `${docType} - Case #${Math.floor(Math.random() * 100000)}`;
        notes = `${docType} for case #${Math.floor(Math.random() * 100000)}. Subject: ${firstName} ${lastName}. Filed with ${company}.`;
        break;
      default:
        name = `${docType} - ${firstName} ${lastName} #${i}`;
        notes = `${docType} document for ${firstName} ${lastName}. Reference: ${Math.random().toString(36).substr(2, 9).toUpperCase()}.`;
    }
    
    const date = randomDate(365);
    const priority = Math.floor(Math.random() * 10) + 1;
    const viewingTag = Math.random() > 0.3 ? viewingTags[Math.floor(Math.random() * viewingTags.length)] : undefined;
    const numImages = Math.floor(Math.random() * 3) + 1; // 1 to 3 images
    
    // Generate different colored backgrounds for variety
    const colors = ['#333333', '#1a4d66', '#4d1a66', '#66331a', '#1a6633', '#661a33'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    const images = [];
    for (let j = 0; j < numImages; j++) {
      images.push(generatePlaceholderImage(`${name} - Page ${j + 1}`, bgColor));
    }
    
    // Add some additional metadata for more realistic testing
    const additionalNotes = [
      ` Scanned on ${new Date(date).toLocaleDateString()}.`,
      ` Quality: ${['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)]}.`,
      ` File size: ${(Math.random() * 10 + 0.5).toFixed(1)}MB.`,
      Math.random() > 0.7 ? ' Contains sensitive information.' : '',
      Math.random() > 0.8 ? ' Requires follow-up action.' : '',
      Math.random() > 0.9 ? ' Digitally signed and verified.' : ''
    ].filter(note => note).join('');
    
    sampleDocuments.push({
      name,
      date,
      type: docType,
      priority,
      notes: notes + additionalNotes,
      viewingTag,
      images
    });
  }
  
  return sampleDocuments;
};

// Generate large dataset function
export const generateLargeDataset = () => {
  return generateSampleDocuments(200); // Generate 200 documents for testing
};

// Generate sample wanted persons data
export const generateSampleWantedPersons = (count: number = 25) => {
  const wantedPersons = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const crimes = [
      'Theft', 'Burglary', 'Assault', 'Fraud', 'Drug Possession', 'DUI',
      'Domestic Violence', 'Vandalism', 'Trespassing', 'Disorderly Conduct',
      'Identity Theft', 'Check Fraud', 'Shoplifting', 'Armed Robbery',
      'Money Laundering', 'Tax Evasion', 'Embezzlement', 'Forgery'
    ];
    
    const crime = crimes[Math.floor(Math.random() * crimes.length)];
    const caseNumber = `CASE-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    const documentNumber = `ID${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    wantedPersons.push({
      id: Date.now().toString() + i,
      fullName,
      photo: generatePlaceholderImage(`WANTED\n${fullName}\n${crime}`, '#8B0000'),
      documentNumber,
      notes: `Wanted for ${crime.toLowerCase()}. Case number: ${caseNumber}. Last seen: ${randomDate(30)}. Height: ${Math.floor(Math.random() * 12) + 60}" Weight: ${Math.floor(Math.random() * 100) + 120}lbs. Hair: ${['Brown', 'Black', 'Blonde', 'Red', 'Gray'][Math.floor(Math.random() * 5)]}. Eyes: ${['Brown', 'Blue', 'Green', 'Hazel'][Math.floor(Math.random() * 4)]}.`,
      createdAt: new Date(randomDate(180)).toISOString()
    });
  }
  
  return wantedPersons;
};
