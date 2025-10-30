import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export function DefaultCheckboxExample() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </label>
    </div>
  );
}

export function CheckboxStatesExample() {
  const [checked, setChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="controlled" 
          checked={checked} 
          onCheckedChange={setChecked}
        />
        <label htmlFor="controlled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Controlled checkbox (checked: {checked.toString()})
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="indeterminate" 
          checked={indeterminate} 
          onCheckedChange={setIndeterminate}
        />
        <label htmlFor="indeterminate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Indeterminate state checkbox
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <label htmlFor="disabled" className="text-sm font-medium leading-none text-muted-foreground cursor-not-allowed opacity-70">
          Disabled checkbox
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <label htmlFor="disabled-checked" className="text-sm font-medium leading-none text-muted-foreground cursor-not-allowed opacity-70">
          Disabled checked
        </label>
      </div>
    </div>
  );
}

export function CheckboxFormExample() {
  const [preferences, setPreferences] = React.useState({
    marketing: false,
    newsletter: true,
    updates: false,
    security: true
  });

  const handlePreferenceChange = (key: keyof typeof preferences) => (checked: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Email Preferences</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="marketing" 
            checked={preferences.marketing}
            onCheckedChange={handlePreferenceChange('marketing')}
          />
          <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Marketing emails
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="newsletter" 
            checked={preferences.newsletter}
            onCheckedChange={handlePreferenceChange('newsletter')}
          />
          <label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Weekly newsletter
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="updates" 
            checked={preferences.updates}
            onCheckedChange={handlePreferenceChange('updates')}
          />
          <label htmlFor="updates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Product updates
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="security" 
            checked={preferences.security}
            onCheckedChange={handlePreferenceChange('security')}
            required
          />
          <label htmlFor="security" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Security notifications (required)
          </label>
        </div>
      </div>
      
      <div className="pt-2 text-sm text-muted-foreground">
        Selected: {Object.entries(preferences).filter(([, value]) => value).map(([key]) => key).join(', ')}
      </div>
    </div>
  );
}