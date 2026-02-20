import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ComponentIcon,
  Heart,
  Pause,
  Play,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ComponentShowcaseItem {
  name: string;
  description: string;
  category: string;
  component?: React.ReactNode;
  interactive?: boolean;
}

const ComponentGrid = () => {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const components: ComponentShowcaseItem[] = [
    {
      name: "Button",
      description: "Button with variants",
      category: "Action",
      // component: (
      //   <div className="flex gap-2">
      //     <Button size="sm">Primary</Button>
      //     <Button variant="outline" size="sm">
      //       Outline
      //     </Button>
      //   </div>
      // ),
    },
    {
      name: "Input",
      description: "Text input with placeholder",
      category: "Form",
      component: <Input placeholder="Enter text..." className="w-full" />,
      interactive: true,
    },
    {
      name: "Card",
      description: "Content container with header",
      category: "Layout",
      component: (
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Card Title</CardTitle>
            <CardDescription className="text-xs">
              Card description
            </CardDescription>
          </CardHeader>
        </Card>
      ),
    },
    {
      name: "Badge",
      description: "Status and label indicators",
      category: "Display",
      component: (
        <div className="flex gap-1">
          <Badge variant="default" className="text-xs">
            New
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>
      ),
    },
    {
      name: "Slider",
      description: "Range input control",
      category: "Form",
      component: (
        <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
      ),
      interactive: true,
    },
    {
      name: "Checkbox",
      description: "Boolean input selection",
      category: "Form",
      component: (
        <div className="flex items-center space-x-2">
          <Checkbox id="demo-check" defaultChecked />
          <label htmlFor="demo-check" className="text-xs">
            Enable feature
          </label>
        </div>
      ),
      interactive: true,
    },
    {
      name: "Avatar",
      description: "User profile pictures",
      category: "Display",
      component: (
        <div className="flex gap-2">
          <Avatar className="w-8 h-8">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
          </Avatar>
          <Avatar className="w-8 h-8">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full" />
          </Avatar>
        </div>
      ),
    },
    {
      name: "Toggle",
      description: "Toggle button state",
      category: "Action",
      component: (
        <div className="flex gap-2">
          <Toggle size="sm" aria-label="Toggle italic">
            <Star className="h-3 w-3" />
          </Toggle>
          <Toggle size="sm" aria-label="Toggle bold" pressed>
            <Heart className="h-3 w-3" />
          </Toggle>
        </div>
      ),
      interactive: true,
    },
    {
      name: "Textarea",
      description: "Multi-line text input",
      category: "Form",
      component: (
        <Textarea
          placeholder="Write your message..."
          rows={2}
          className="text-xs"
        />
      ),
      interactive: true,
    },
    {
      name: "Tabs",
      description: "Tabbed content navigation",
      category: "Navigation",
      component: (
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="tab1" className="text-xs">
              Tab 1
            </TabsTrigger>
            <TabsTrigger value="tab2" className="text-xs">
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p>Tab 1 content</p>
          </TabsContent>
          <TabsContent value="tab2">
            <p>Tab 2 content</p>
          </TabsContent>
        </Tabs>
      ),
      interactive: true,
    },
    {
      name: "Dialog",
      description: "Modal dialog windows",
      category: "Overlay",
      component: (
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Component Dialog</DialogTitle>
              <DialogDescription>
                This is a modal dialog built with DinachiUI components.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ),
      interactive: true,
    },
    {
      name: "Tooltip",
      description: "Contextual help information",
      category: "Overlay",
      component: (
        <Tooltip>
          <TooltipTrigger>
            <Zap className="h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">This is a tooltip</p>
          </TooltipContent>
        </Tooltip>
      ),
      interactive: true,
    },
    {
      name: "Alert Dialog",
      description: "Important confirmations",
      category: "Overlay",
      component: (
        <AlertDialog>
          <AlertDialogTrigger>Delete</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogBackdrop />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialogPortal>
        </AlertDialog>
      ),
      interactive: true,
    },
    {
      name: "More Components",
      description: "Explore our full library",
      category: "Meta",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xs text-center">35+ components available</span>
        </div>
      ),
    },
  ];

  // Auto-highlight functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentHighlight((prev) => (prev + 1) % components.length);
      }, 2500); // Change highlight every 2.5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, components.length]);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const categories = Array.from(new Set(components.map((c) => c.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-accent/10 to-transparent border border-accent rounded-xl translate-y-9 backdrop-blur-xl">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center">
            <ComponentIcon className="hidden md:block mr-2 w-6 h-6 text-primary" />
            <div>
              <h2 className="font-medium text-xl">Components</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={togglePause}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-secondary/60 hover:bg-secondary rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" />
                  Pause
                </>
              )}
            </motion.button>

            {/* Category indicators */}
            <div className="flex gap-1">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    components[currentHighlight]?.category === category
                      ? "bg-primary"
                      : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {components.map((item, index) => {
            const isHighlighted = index === currentHighlight;
            const isHovered = hoveredIndex === index;
            const shouldShowGlow = (isHighlighted && !isPaused) || isHovered;

            return (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className={`
                    relative overflow-hidden bg-background inset-shadow rounded p-4 h-32
                    transition-all duration-300 cursor-pointer
                    ${
                      shouldShowGlow
                        ? "shadow-lg scale-105 bg-muted/40"
                        : "shadow-sm hover:shadow-md"
                    }
                  `}
                  layout
                  animate={{
                    borderColor: shouldShowGlow
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-dot mix-blend-screen opacity-15" />
                  {/* Background glow effect */}
                  <AnimatePresence>
                    {shouldShowGlow && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent to-transparent blur-2xl"
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "100%", opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          x: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          opacity: { duration: 0.3 },
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <motion.h4
                        className="text-lg lg:text-xl"
                        animate={{
                          color: shouldShowGlow
                            ? "hsl(var(--primary))"
                            : "hsl(var(--foreground))",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.h4>
                      
                    </div>

                    <p className="text-sm text-muted-foreground/70 mb-3 flex-shrink-0">
                      {item.description}
                    </p>

                    <Badge
                        variant="outline"
                        className={`text-xs self-end w-fit transition-colors gap-1 ${
                          shouldShowGlow ? "bg-card text-card-foreground" : ""
                        }`}
                      >
                        {item.category}
                      </Badge>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            {components.map((_, idx) => (
              <motion.button
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentHighlight
                    ? "bg-primary"
                    : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                }`}
                onClick={() => setCurrentHighlight(idx)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  scale: { delay: 1.2 + idx * 0.02, duration: 0.2 },
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Current component info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHighlight}
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">
              Currently highlighting:{" "}
              <span className="text-primary font-medium">
                {components[currentHighlight]?.name}
              </span>{" "}
              - {components[currentHighlight]?.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ComponentGrid;
