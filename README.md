# Freelancer Invoice Generator 🧾

A professional, full-featured invoice generator built with React, designed to help freelancers and small businesses manage their invoicing needs efficiently.

![Invoice Generator](https://img.shields.io/badge/React-18.2-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **📄 Invoice Management**: Create, edit, and delete professional invoices
- **👥 Client Database**: Manage your clients with detailed contact information
- **📊 Dashboard**: Real-time overview of revenue, pending payments, and overdue invoices
- **💾 PDF Export**: Generate professional PDF invoices with one click
- **📱 Fully Responsive**: Beautiful UI that works on desktop, tablet, and mobile
- **🎨 Professional Design**: Clean, modern interface with a polished color scheme
- **💼 Status Tracking**: Track invoice status (Pending, Paid, Overdue, Cancelled)
- **🔢 Automatic Calculations**: Auto-calculate subtotals, taxes, and totals

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project folder
```bash
cd invoice-generator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🛠️ Built With

- **React 18** - UI Framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **jsPDF** - PDF Generation
- **date-fns** - Date Formatting
- **Lucide React** - Icons

## 📱 Pages & Features

### Dashboard
- Overview of total invoices and clients
- Revenue tracking (paid and pending)
- Recent invoices list
- Overdue invoice alerts
- Quick action buttons

### Invoices
- List all invoices with filtering by status
- Create new invoices with detailed items
- Edit existing invoices
- Delete invoices
- Download invoices as PDF
- Status-based color coding

### Clients
- Add and manage client information
- Client cards with contact details
- Edit and delete clients
- Beautiful grid layout

### Invoice Creation
- Multi-item invoice builder
- Dynamic item addition/removal
- Automatic calculation of totals
- Client selection
- Date pickers for issue and due dates
- Status selection
- Notes section
- Real-time summary sidebar

## 💡 Usage Tips

1. **Start by adding clients** - Go to the Clients page and add your first client
2. **Create an invoice** - Navigate to Invoices → Create Invoice
3. **Fill in details** - Select a client, add items, set dates
4. **Save and export** - Save the invoice and download as PDF
5. **Track payments** - Update invoice status as payments come in

## 🎨 Customization

The app uses Tailwind CSS for styling. You can customize the color scheme by editing [tailwind.config.js](tailwind.config.js):

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      },
    },
  },
}
```

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Built with ❤️ as part of a professional portfolio

---

## Here is the live link of the site 
https://invoice-pro-d1hh.vercel.app
