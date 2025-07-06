import { useState } from "react";
// Update the import path below if @ alias is not configured, e.g.:
import { Header } from "../components/health-portal/Header";
import { Sidebar } from "../components/health-portal/Sidebar";
import { FloatingParticles } from "../components/health-portal/FloatingParticles";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, UserPlus, Calendar, Activity } from "lucide-react";

const mockPatients = [
  {
    id: 1,
    name: "Sarah Marie Johnson",
    age: 39, // Calculated from 1985-03-15
    gender: "female",
    city: "Boston",
    state: "MA",
    country: "USA",
    condition: "Genetic Test: BRCA1 Pathogenic Variant",
    status: "Scheduled",
    lastVisit: "2025-06-15",
    upcomingAppointment: "2025-07-10"
  },
  {
    id: 2,
    name: "Michael Wei Chen",
    age: 46, // Calculated from 1978-11-22
    gender: "male",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    condition: "Pharmacogenomics: Warfarin Poor Metabolizer",
    status: "In Progress",
    lastVisit: "2025-06-20",
    upcomingAppointment: "2025-07-15"
  },
  {
    id: 3,
    name: "Maria Elena Rodriguez",
    age: 32, // Calculated from 1992-07-08
    gender: "female",
    city: "Miami",
    state: "FL",
    country: "USA",
    condition: "Cancer Risk Assessment: Pathogenic Germline Variant",
    status: "Completed",
    lastVisit: "2025-06-25",
    upcomingAppointment: null
  }
];

const Patients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-primary text-primary-foreground';
      case 'In Progress': return 'bg-warning text-warning-foreground';
      case 'Completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        } mt-16 p-8 space-y-8`}>
          
          <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Patient Management
              </h1>
              <Button className="bg-gradient-primary glow-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Patient
              </Button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="glass border-border-strong interactive">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{patient.name}</CardTitle>
                        <p className="text-foreground-secondary">Age: {patient.age}</p>
                      </div>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Condition</p>
                          <p className="text-sm text-foreground-secondary">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Last Visit</p>
                          <p className="text-sm text-foreground-secondary">{patient.lastVisit}</p>
                        </div>
                      </div>
                      {patient.upcomingAppointment && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-success" />
                          <div>
                            <p className="text-sm font-medium">Next Appointment</p>
                            <p className="text-sm text-foreground-secondary">{patient.upcomingAppointment}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Schedule</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Patients;