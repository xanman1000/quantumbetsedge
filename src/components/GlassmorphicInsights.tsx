import { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  BarChart4, 
  Zap,
  PieChart,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from "react-router-dom";

const statsData = [
  { 
    label: 'Win Rate', 
    value: '68%', 
    icon: TrendingUp,
    change: '+2.5%',
    positive: true,
    description: 'Our win rate across all sports for the past 30 days'
  },
  { 
    label: 'Net ROI', 
    value: '22%', 
    icon: PieChart,
    change: '+3.1%',
    positive: true,
    description: 'Average return on investment for all placed picks'
  },
  { 
    label: 'Subscribers', 
    value: '8.2K+', 
    icon: Users,
    change: '+12%',
    positive: true,
    description: 'Growth in our subscriber base over the last quarter'
  },
];

const insightsData = [
  {
    id: 'item-1',
    title: 'Advanced Statistical Models',
    content: 'Our proprietary AI models analyze thousands of data points including player performance, team dynamics, historical matchups, and even weather conditions to provide the most accurate predictions possible.',
    icon: BarChart4,
  },
  {
    id: 'item-2',
    title: 'Real-time Adjustments',
    content: 'Unlike static prediction services, our algorithm constantly updates odds and recommendations based on game-day developments including lineup changes, injury reports, and betting line movements.',
    icon: Zap,
  },
  {
    id: 'item-3',
    title: 'Proven Track Record',
    content: 'With a documented 68% win rate across all major sports, our system has outperformed traditional handicappers and competing AI services for three consecutive years.',
    icon: Award,
  },
];

const GlassmorphicInsights = () => {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/20 z-0" />
      
      {/* Animated circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-200 mb-4 border-purple-500/50 px-4 py-1">
            QUANTUM EDGE
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Metrics</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Our AI-powered analytics provide unmatched accuracy and precision in sports predictions.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 font-medium text-sm mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                </div>
                <div className="p-2 rounded-full bg-purple-500/20">
                  <stat.icon className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
                <span className="text-gray-400 text-sm ml-2">vs last period</span>
              </div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-purple-400 hover:text-purple-300 text-sm mt-2">
                    View details
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-black/95 border-purple-900/50 text-white">
                  <div className="mx-auto w-full max-w-lg">
                    <DrawerHeader>
                      <DrawerTitle className="text-white text-2xl">{stat.label} Details</DrawerTitle>
                      <DrawerDescription className="text-gray-400">
                        {stat.description}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <div className="rounded-lg bg-purple-950/30 p-6 border border-purple-900/50">
                        <h4 className="font-medium text-xl text-white mb-2">Performance Breakdown</h4>
                        <p className="text-gray-300 mb-4">
                          Our {stat.label.toLowerCase()} has been consistently improving over time, demonstrating the effectiveness of our advanced AI models and data analysis.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-400">NFL</span>
                              <span className="text-sm text-white">72%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-400">NBA</span>
                              <span className="text-sm text-white">68%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-400">MLB</span>
                              <span className="text-sm text-white">65%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline" className="border-purple-900/50 text-white hover:bg-purple-500/20">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </motion.div>
          ))}
        </div>
        
        {/* Accordion Section */}
        <div className="max-w-3xl mx-auto backdrop-blur-lg bg-white/5 rounded-2xl p-1 border border-white/10 shadow-xl overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {insightsData.map((item, index) => (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="border-b border-white/10 last:border-0"
              >
                <AccordionTrigger className="py-6 px-6 text-white hover:text-purple-300 hover:no-underline text-left font-medium text-lg">
                  <div className="flex items-center">
                    <div className="p-2 mr-4 rounded-full bg-purple-500/20">
                      <item.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-16 pb-6 pt-0 text-gray-300">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-6 px-8 rounded-full transition-all shadow-lg hover:shadow-purple-500/25 text-lg font-medium"
            asChild
          >
            <Link to="/signup">
              Upgrade to Pro Analytics
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GlassmorphicInsights; 