
# DocVault - Modern Document Management System

A modern, offline-first document archiving and management web application built with React and TypeScript. DocVault provides secure, local document storage and management without requiring internet connectivity.

## 🚀 Features

### Core Functionality
- **📸 Smart Document Scanning** - Capture documents with front/back support
- **🔐 Secure Local Storage** - All data stored locally in browser storage
- **📁 Document Organization** - Categorize by type, priority, and custom tags
- **🔍 Advanced Search** - Find documents quickly with intelligent filtering
- **📊 Visual Dashboard** - Overview of document statistics and recent activity
- **📋 Wanted Persons Database** - Track persons of interest with document references

### User Experience
- **🌍 Multi-Language Support** - English and Arabic localization
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Modern UI** - Clean interface built with Tailwind CSS and shadcn/ui
- **⚡ Real-time Updates** - Instant feedback with toast notifications
- **🌙 Dark/Light Theme** - Customizable appearance settings

### Data Management
- **💾 Local Data Persistence** - Browser localStorage for offline operation
- **📤 Export/Import** - Backup and restore functionality
- **🔄 Sample Data** - Quick setup with demonstration data
- **🗑️ Data Management** - Clear all data option for fresh starts

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast development and build tooling

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icon library
- **Radix UI** - Accessible component primitives

### State Management & Data
- **React Query (TanStack)** - Data fetching and caching
- **React Context** - Global state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **date-fns** - Date manipulation utilities

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── document/       # Document-specific components
│   └── ui/             # shadcn/ui components
├── context/            # React context providers
├── core/               # Core business logic
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── translations/       # Internationalization files
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📖 Usage

### Adding Documents
1. Navigate to the **Scan Document** page
2. Use the camera interface to capture document images
3. Fill in document details (name, type, priority, notes)
4. Save the document to your local archive

### Managing Documents
- **View All Documents** - Browse your complete document library
- **Search & Filter** - Find specific documents quickly
- **Edit Details** - Update document information
- **Delete Documents** - Remove unwanted entries

### Dashboard Overview
- View document statistics and trends
- See recent activity
- Quick access to common actions

### Settings & Preferences
- Toggle dark/light theme
- Change language (English/Arabic)
- Export/import data
- Clear all data

## 🌐 Deployment

### Web Hosting
The application can be deployed to any static hosting service:
- **Vercel** - Recommended for React applications
- **Netlify** - Easy deployment with git integration
- **GitHub Pages** - Free hosting for open source projects

### Local Network Deployment
For air-gapped or local network environments:
1. Build the application
2. Serve the `dist/` folder with any web server
3. Access via local IP address

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic operation. All data is stored locally in the browser.

### Customization
- **Themes** - Modify Tailwind configuration for custom styling
- **Languages** - Add new translations in `src/translations/`
- **Document Types** - Extend document categories in the codebase

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🔮 Future Enhancements

- **AI Integration** - Document categorization and OCR
- **Cloud Sync** - Optional cloud backup capabilities
- **Advanced Analytics** - Detailed reporting and insights
- **Mobile App** - Native mobile companion application
- **Plugin System** - Extensible architecture for custom features

## 📞 Support

For questions, issues, or feature requests, please open an issue on the project repository.

---

**DocVault** - Secure, Modern, Offline-First Document Management
