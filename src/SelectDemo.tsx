import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@dinachi/components";
import { Check, Star, Crown, Shield, Zap } from "lucide-react";

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly department: string;
  readonly isSelected?: boolean;
}

const users: readonly User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    department: "Engineering",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Designer",
    department: "Design",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    department: "Engineering",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Developer",
    department: "Engineering",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Designer",
    department: "Design",
  },
  {
    id: "6",
    name: "Diana Wilson",
    email: "diana@example.com",
    role: "Product Manager",
    department: "Product",
  },
  {
    id: "7",
    name: "Eve Taylor",
    email: "eve@example.com",
    role: "QA Engineer",
    department: "Engineering",
  },
  {
    id: "8",
    name: "Frank Miller",
    email: "frank@example.com",
    role: "DevOps",
    department: "Engineering",
  },
  {
    id: "9",
    name: "Grace Lee",
    email: "grace@example.com",
    role: "UX Researcher",
    department: "Design",
  },
  {
    id: "10",
    name: "Henry Clark",
    email: "henry@example.com",
    role: "Data Analyst",
    department: "Analytics",
  },
] as const;

const countries = [
  { value: "us", label: "United States", region: "North America" },
  { value: "ca", label: "Canada", region: "North America" },
  { value: "mx", label: "Mexico", region: "North America" },
  { value: "uk", label: "United Kingdom", region: "Europe" },
  { value: "de", label: "Germany", region: "Europe" },
  { value: "fr", label: "France", region: "Europe" },
  { value: "jp", label: "Japan", region: "Asia" },
  { value: "cn", label: "China", region: "Asia" },
  { value: "in", label: "India", region: "Asia" },
  { value: "au", label: "Australia", region: "Oceania" },
] as const;

const premiumFeatures = [
  { value: "basic", label: "Basic Plan", icon: <Check className="h-4 w-4" /> },
  { value: "pro", label: "Pro Plan", icon: <Star className="h-4 w-4" /> },
  { value: "enterprise", label: "Enterprise Plan", icon: <Crown className="h-4 w-4" /> },
  { value: "security", label: "Security Add-on", icon: <Shield className="h-4 w-4" /> },
  { value: "performance", label: "Performance Boost", icon: <Zap className="h-4 w-4" /> },
] as const;

export function SelectDemo(): JSX.Element {
  const [basicValue, setBasicValue] = React.useState<string>("");
  const [userValue, setUserValue] = React.useState<string>("");
  const [countryValue, setCountryValue] = React.useState<string>("");
  const [controlledValue, setControlledValue] = React.useState<string>("apple");
  const [indicatorValue, setIndicatorValue] = React.useState<string>("");
  const [customIconValue, setCustomIconValue] = React.useState<string>("");
  const [rightIndicatorValue, setRightIndicatorValue] = React.useState<string>("");

  const handleBasicChange = React.useCallback((value: string) => {
    setBasicValue(value);
  }, []);

  const handleUserChange = React.useCallback((value: string) => {
    setUserValue(value);
  }, []);

  const handleCountryChange = React.useCallback((value: string) => {
    setCountryValue(value);
  }, []);

  const handleControlledChange = React.useCallback((value: string) => {
    setControlledValue(value);
  }, []);

  const handleIndicatorChange = React.useCallback((value: string) => {
    setIndicatorValue(value);
  }, []);

  const handleCustomIconChange = React.useCallback((value: string) => {
    setCustomIconValue(value);
  }, []);

  const handleRightIndicatorChange = React.useCallback((value: string) => {
    setRightIndicatorValue(value);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Select Component Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive examples showcasing the Select component's capabilities including new indicator features
        </p>
      </div>

      {/* Basic Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Usage</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Simple select with fruit options
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={basicValue} onValueChange={handleBasicChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">🍎 Apple</SelectItem>
              <SelectItem value="banana">🍌 Banana</SelectItem>
              <SelectItem value="blueberry">🫐 Blueberry</SelectItem>
              <SelectItem value="grapes">🍇 Grapes</SelectItem>
              <SelectItem value="pineapple">🍍 Pineapple</SelectItem>
              <SelectItem value="strawberry">🍓 Strawberry</SelectItem>
            </SelectContent>
          </Select>
          {basicValue && (
            <span className="text-sm text-muted-foreground">
              Selected: {basicValue}
            </span>
          )}
        </div>
      </section>

      {/* NEW: Indicator Features */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Left Indicator (Default)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select with left-positioned check indicators
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={indicatorValue} onValueChange={handleIndicatorChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1" showIndicator>
                Option 1
              </SelectItem>
              <SelectItem value="option2" showIndicator>
                Option 2
              </SelectItem>
              <SelectItem value="option3" showIndicator>
                Option 3
              </SelectItem>
              <SelectItem value="option4" showIndicator>
                Option 4
              </SelectItem>
            </SelectContent>
          </Select>
          {indicatorValue && (
            <span className="text-sm text-muted-foreground">
              Selected: {indicatorValue}
            </span>
          )}
        </div>
      </section>

      {/* NEW: Custom Icon Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Custom Icon Indicators</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select with custom icons as indicators
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={customIconValue} onValueChange={handleCustomIconChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {premiumFeatures.map((feature) => (
                <SelectItem
                  key={feature.value}
                  value={feature.value}
                  showIndicator
                  indicatorIcon={feature.icon}
                >
                  {feature.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {customIconValue && (
            <span className="text-sm text-muted-foreground">
              Selected: {premiumFeatures.find(f => f.value === customIconValue)?.label}
            </span>
          )}
        </div>
      </section>

      {/* NEW: Right Indicator */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Right Indicator</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select with right-positioned indicators
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={rightIndicatorValue} onValueChange={handleRightIndicatorChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem 
                value="low" 
                showIndicator 
                indicatorPosition="right"
                indicatorIcon={<div className="w-2 h-2 bg-green-500 rounded-full" />}
              >
                Low Priority
              </SelectItem>
              <SelectItem 
                value="medium" 
                showIndicator 
                indicatorPosition="right"
                indicatorIcon={<div className="w-2 h-2 bg-yellow-500 rounded-full" />}
              >
                Medium Priority
              </SelectItem>
              <SelectItem 
                value="high" 
                showIndicator 
                indicatorPosition="right"
                indicatorIcon={<div className="w-2 h-2 bg-red-500 rounded-full" />}
              >
                High Priority
              </SelectItem>
              <SelectItem 
                value="critical" 
                showIndicator 
                indicatorPosition="right"
                indicatorIcon={<div className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />}
              >
                Critical Priority
              </SelectItem>
            </SelectContent>
          </Select>
          {rightIndicatorValue && (
            <span className="text-sm text-muted-foreground">
              Selected: {rightIndicatorValue}
            </span>
          )}
        </div>
      </section>

      {/* Controlled Component */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Controlled Component</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select with external state control and reset functionality
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={controlledValue}
            onValueChange={handleControlledChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple" showIndicator>🍎 Apple</SelectItem>
              <SelectItem value="banana" showIndicator>🍌 Banana</SelectItem>
              <SelectItem value="orange" showIndicator>🍊 Orange</SelectItem>
              <SelectItem value="grape" showIndicator>🍇 Grape</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={() => setControlledValue("")}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Clear
          </button>
          <span className="text-sm text-muted-foreground">
            Value: "{controlledValue}"
          </span>
        </div>
      </section>

      {/* Grouped Options with Mixed Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Mixed Indicator Styles</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select with different indicator styles per group
          </p>
        </div>
        <Select value={countryValue} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>North America (Left Indicators)</SelectLabel>
              {countries
                .filter((country) => country.region === "North America")
                .map((country) => (
                  <SelectItem 
                    key={country.value} 
                    value={country.value}
                    showIndicator
                    indicatorPosition="left"
                  >
                    {country.label}
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Europe (Right Indicators)</SelectLabel>
              {countries
                .filter((country) => country.region === "Europe")
                .map((country) => (
                  <SelectItem 
                    key={country.value} 
                    value={country.value}
                    showIndicator
                    indicatorPosition="right"
                  >
                    {country.label}
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Asia (No Indicators)</SelectLabel>
              {countries
                .filter((country) => country.region === "Asia")
                .map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Oceania (Custom Icons)</SelectLabel>
              {countries
                .filter((country) => country.region === "Oceania")
                .map((country) => (
                  <SelectItem 
                    key={country.value} 
                    value={country.value}
                    showIndicator
                    indicatorIcon={<Star className="h-4 w-4 text-yellow-500" />}
                  >
                    {country.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      {/* Large Dataset with Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Large Dataset with Indicators</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select with many options showcasing indicator performance
          </p>
        </div>
        <Select value={userValue} onValueChange={handleUserChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Engineering</SelectLabel>
              {users
                .filter((user) => user.department === "Engineering")
                .map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    showIndicator
                    indicatorIcon={<Shield className="h-4 w-4 text-blue-500" />}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.role} • {user.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Design</SelectLabel>
              {users
                .filter((user) => user.department === "Design")
                .map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    showIndicator
                    indicatorPosition="right"
                    indicatorIcon={<Star className="h-4 w-4 text-purple-500" />}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.role} • {user.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Other</SelectLabel>
              {users
                .filter(
                  (user) => !["Engineering", "Design"].includes(user.department)
                )
                .map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    showIndicator
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.role} • {user.department} • {user.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      {/* Different Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Different Sizes</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select components with various widths and indicators
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium w-20">Small:</label>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs" showIndicator>XS</SelectItem>
                <SelectItem value="s" showIndicator>S</SelectItem>
                <SelectItem value="m" showIndicator>M</SelectItem>
                <SelectItem value="l" showIndicator>L</SelectItem>
                <SelectItem value="xl" showIndicator>XL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium w-20">Medium:</label>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1" showIndicator indicatorPosition="right">
                  Option 1
                </SelectItem>
                <SelectItem value="option2" showIndicator indicatorPosition="right">
                  Option 2
                </SelectItem>
                <SelectItem value="option3" showIndicator indicatorPosition="right">
                  Option 3
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium w-20">Large:</label>
            <Select>
              <SelectTrigger className="w-[350px]">
                <SelectValue placeholder="Select a longer option with more text" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  value="long1" 
                  showIndicator 
                  indicatorIcon={<Zap className="h-4 w-4 text-yellow-500" />}
                >
                  This is a very long option with lots of text
                </SelectItem>
                <SelectItem 
                  value="long2" 
                  showIndicator 
                  indicatorIcon={<Crown className="h-4 w-4 text-gold-500" />}
                >
                  Another long option that demonstrates text handling
                </SelectItem>
                <SelectItem 
                  value="long3" 
                  showIndicator 
                  indicatorIcon={<Star className="h-4 w-4 text-purple-500" />}
                >
                  Yet another lengthy option for testing purposes
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Disabled States</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select components in various disabled states with indicators
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium w-32">Disabled Select:</label>
            <Select disabled>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Cannot select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1" showIndicator>Option 1</SelectItem>
                <SelectItem value="option2" showIndicator>Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium w-32">Disabled Items:</label>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Some disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available1" showIndicator>Available Option 1</SelectItem>
                <SelectItem value="disabled1" disabled showIndicator>
                  Disabled Option 1
                </SelectItem>
                <SelectItem value="available2" showIndicator>Available Option 2</SelectItem>
                <SelectItem value="disabled2" disabled showIndicator>
                  Disabled Option 2
                </SelectItem>
                <SelectItem value="available3" showIndicator>Available Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* State Display */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Current State</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Display of all current selection states
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Basic Value:</strong> {basicValue || "None"}
            </div>
            <div>
              <strong>Controlled Value:</strong> {controlledValue || "None"}
            </div>
            <div>
              <strong>Indicator Value:</strong> {indicatorValue || "None"}
            </div>
            <div>
              <strong>Custom Icon Value:</strong> {customIconValue || "None"}
            </div>
            <div>
              <strong>Right Indicator:</strong> {rightIndicatorValue || "None"}
            </div>
            <div>
              <strong>Country:</strong>{" "}
              {countryValue
                ? countries.find((c) => c.value === countryValue)?.label
                : "None"}
            </div>
            <div>
              <strong>User:</strong>{" "}
              {userValue ? users.find((u) => u.id === userValue)?.name : "None"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}