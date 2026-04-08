# Country Code Selector Component

A reusable React component for selecting country phone codes with search functionality.

## Files Created

- **`lib/countries.json`** - Complete list of 195+ countries with their dial codes
- **`components/CountryCodeSelector.js`** - Main reusable component
- **`components/PhoneNumberForm.js`** - Example form component showing integration

## Features

✅ 195+ countries with dial codes (e.g., +250, +1, +44)  
✅ Searchable dropdown - search by country name or dial code  
✅ Clean Tailwind CSS styling  
✅ Keyboard accessible  
✅ Click-outside detection to close dropdown  
✅ Fully reusable component  
✅ No external dependencies required  

## Basic Usage

### Simple Integration

```jsx
import CountryCodeSelector from '@/components/CountryCodeSelector';

export default function MyForm() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryChange = (country) => {
    console.log('Selected:', country);
    // country object contains: { name, code, dialCode }
  };

  return (
    <CountryCodeSelector
      value={selectedCountry}
      onChange={handleCountryChange}
      placeholder="Select country..."
    />
  );
}
```

### What the Component Returns

When a user selects a country, the `onChange` callback receives an object:

```javascript
{
  name: "Rwanda",           // Country name
  code: "RW",              // ISO country code
  dialCode: "+250"         // Dial code to return
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | object | `null` | Currently selected country object |
| `onChange` | function | `null` | Callback fired when country is selected |
| `placeholder` | string | `"Select country..."` | Dropdown placeholder text |
| `className` | string | `""` | Additional CSS classes for the container |

## Complete Form Example

See **`components/PhoneNumberForm.js`** for a full working example that:
- Uses the CountryCodeSelector
- Combines with a phone number input
- Displays the full phone number with dial code

## Access the Dial Code

```javascript
// After user selects a country
const dialCode = selectedCountry.dialCode; // e.g., "+250"
const fullNumber = `${dialCode}${userPhoneInput}`; // e.g., "+250701234567"
```

## Styling

The component uses Tailwind CSS classes and respects your project's Tailwind configuration. All styles are built-in:

- Blue focus ring on interaction
- Smooth transitions and animations
- Responsive design
- Max-height overflow with scrolling
- Hover states and selected state styling

## Search Functionality

Users can search by:
- **Country name** - e.g., "Rwanda", "United States"
- **Dial code** - e.g., "+250", "+1", "+44"
- **Partial matches** - e.g., typing "rwan" finds Rwanda

## Testing

To test the component with the example form:

```bash
# In your Next.js project root
npm run dev
```

Then navigate to a page and import `PhoneNumberForm`:

```jsx
import PhoneNumberForm from '@/components/PhoneNumberForm';

export default function TestPage() {
  return <PhoneNumberForm />;
}
```

## Customization

### Change Placeholder
```jsx
<CountryCodeSelector placeholder="Choose your region..." />
```

### Add Custom Styling
```jsx
<CountryCodeSelector className="max-w-sm" />
```

### Pre-select a Country
```jsx
const defaultCountry = countries.find(c => c.code === 'RW');
<CountryCodeSelector value={defaultCountry} onChange={handleChange} />
```

## Data Source

All country data is stored in `lib/countries.json` with properties:
- `name` - Full country name
- `code` - ISO 3166-1 alpha-2 country code
- `dialCode` - International dial code

You can easily update this JSON file if needed (e.g., to add custom countries or regions).

---

**Ready to use!** Simply import the component and integrate it into your forms.
