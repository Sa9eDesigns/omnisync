import React, { useState } from "react";
import { cn } from "../utils/cn";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  StatsCard 
} from "./Card";
import { Button } from "./Button";
import { Badge, StatusBadge, NotificationBadge } from "./Badge";
import { SimpleTabs } from "./Tabs";
import { Table } from "./Table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./Sheet";
import { 
  Layout, 
  Header, 
  Main, 
  Container, 
  Grid, 
  Stack, 
  Inline,
  PageLayout,
  useBreakpoint 
} from "./Layout";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuGroup,
  SidebarTrigger,
  SidebarLayout 
} from "./Sidebar";
import { ToastProvider, useToast } from "./Toast";
import { InputComponent, SearchInput } from "./Input";
import {
  Activity,
  Users,
  TrendingUp,
  Settings,
  Home,
  Music,
  Headphones,
  Mic,
  Speaker,
  Wifi,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Share,
  MoreHorizontal,
} from "lucide-react";

// Sample data for demonstrations
const sampleTableData = [
  { id: 1, name: "Device 1", status: "online", latency: "45ms", quality: "excellent" },
  { id: 2, name: "Device 2", status: "connecting", latency: "120ms", quality: "good" },
  { id: 3, name: "Device 3", status: "offline", latency: "-", quality: "-" },
  { id: 4, name: "Device 4", status: "online", latency: "67ms", quality: "good" },
];

const tableColumns = [
  { key: "name", header: "Device Name", sortable: true },
  { 
    key: "status", 
    header: "Status", 
    accessor: (item: any) => <StatusBadge status={item.status} />,
    mobileLabel: "Status"
  },
  { key: "latency", header: "Latency", sortable: true, mobileLabel: "Ping" },
  { key: "quality", header: "Quality", sortable: true },
];

export const ComponentShowcase: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();
  const { breakpoint, isMobile, isDesktop } = useBreakpoint();

  const showToast = (type: "success" | "error" | "warning" | "info") => {
    addToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      description: `This is a ${type} toast notification on ${breakpoint} breakpoint`,
      duration: 3000,
    });
  };

  const tabsData = [
    {
      value: "overview",
      label: "Overview",
      icon: <Home className="h-4 w-4" />,
      content: (
        <Stack gap="lg">
          <Grid cols={1} responsive={{ md: 2, lg: 4 }} gap="md">
            <StatsCard
              title="Active Devices"
              value="12"
              description="Connected audio devices"
              trend={{ value: 8.2, isPositive: true }}
              icon={<Headphones className="h-6 w-6" />}
            />
            <StatsCard
              title="Average Latency"
              value="45ms"
              description="Real-time audio delay"
              trend={{ value: 12.5, isPositive: false }}
              icon={<Activity className="h-6 w-6" />}
            />
            <StatsCard
              title="Data Transfer"
              value="2.4GB"
              description="Today's audio data"
              trend={{ value: 15.3, isPositive: true }}
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <StatsCard
              title="Active Users"
              value="8"
              description="Currently streaming"
              icon={<Users className="h-6 w-6" />}
            />
          </Grid>

          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>
                Manage your connected audio devices and monitor their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table
                data={sampleTableData}
                columns={tableColumns}
                searchable
                searchPlaceholder="Search devices..."
                rowActions={(item) => (
                  <Inline gap="sm">
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </Inline>
                )}
              />
            </CardContent>
          </Card>
        </Stack>
      ),
    },
    {
      value: "devices",
      label: "Devices",
      icon: <Headphones className="h-4 w-4" />,
      badge: "4",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Audio Devices</CardTitle>
            <CardDescription>Configure your audio input and output devices</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <Inline justify="between" className="flex-col sm:flex-row gap-4">
                <SearchInput
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                  className="w-full sm:w-auto"
                />
                <Inline gap="sm">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    Add Device
                  </Button>
                  <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
                    Filter
                  </Button>
                </Inline>
              </Inline>

              <Grid cols={1} responsive={{ md: 2 }} gap="md">
                {sampleTableData.map((device) => (
                  <Card key={device.id} interactive>
                    <CardContent>
                      <Inline justify="between" align="start">
                        <Stack gap="sm">
                          <Inline gap="sm" align="center">
                            <Mic className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">{device.name}</span>
                          </Inline>
                          <Inline gap="sm">
                            <StatusBadge status={device.status as any} size="sm" />
                            <Badge variant="outline" size="sm">
                              {device.latency}
                            </Badge>
                          </Inline>
                        </Stack>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Inline>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Configure your OmniSync preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="lg">
              <div>
                <h3 className="text-lg font-medium mb-4">Audio Quality</h3>
                <Grid cols={1} responsive={{ sm: 3 }} gap="md">
                  <Card variant="outline" interactive>
                    <CardContent padding="md">
                      <Stack gap="sm" align="center">
                        <Badge variant="success">Recommended</Badge>
                        <h4 className="font-medium">Balanced</h4>
                        <p className="text-sm text-gray-600 text-center">
                          Good quality with low latency
                        </p>
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card variant="outline" interactive>
                    <CardContent padding="md">
                      <Stack gap="sm" align="center">
                        <h4 className="font-medium">High Quality</h4>
                        <p className="text-sm text-gray-600 text-center">
                          Best audio quality
                        </p>
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card variant="outline" interactive>
                    <CardContent padding="md">
                      <Stack gap="sm" align="center">
                        <h4 className="font-medium">Low Latency</h4>
                        <p className="text-sm text-gray-600 text-center">
                          Minimal delay
                        </p>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <Stack gap="md">
                  <Inline gap="md">
                    <Button
                      variant="outline"
                      onClick={() => showToast("success")}
                    >
                      Success Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => showToast("error")}
                    >
                      Error Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => showToast("warning")}
                    >
                      Warning Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => showToast("info")}
                    >
                      Info Toast
                    </Button>
                  </Inline>
                </Stack>
              </div>
            </Stack>
          </CardContent>
          <CardFooter>
            <Inline gap="sm" className="w-full flex-col sm:flex-row">
              <Button fullWidth={isMobile}>Save Changes</Button>
              <Button variant="outline" fullWidth={isMobile}>
                Reset to Defaults
              </Button>
            </Inline>
          </CardFooter>
        </Card>
      ),
    },
  ];

  return (
    <ToastProvider>
      <SidebarProvider>
        <Layout>
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar>
              <SidebarHeader>
                <Inline gap="sm" align="center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                      OmniSync
                    </h2>
                    <p className="text-xs text-gray-500">Audio Streaming</p>
                  </div>
                </Inline>
              </SidebarHeader>

              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem icon={<Home className="h-5 w-5" />} active>
                    Dashboard
                  </SidebarMenuItem>
                  <SidebarMenuItem 
                    icon={<Headphones className="h-5 w-5" />}
                    badge="4"
                  >
                    Devices
                  </SidebarMenuItem>
                  <SidebarMenuItem icon={<Activity className="h-5 w-5" />}>
                    Analytics
                  </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenuGroup label="Audio">
                  <SidebarMenuItem icon={<Mic className="h-5 w-5" />}>
                    Input Sources
                  </SidebarMenuItem>
                  <SidebarMenuItem icon={<Speaker className="h-5 w-5" />}>
                    Output Devices
                  </SidebarMenuItem>
                  <SidebarMenuItem icon={<Wifi className="h-5 w-5" />}>
                    Network
                  </SidebarMenuItem>
                </SidebarMenuGroup>
              </SidebarContent>
            </Sidebar>

            {/* Main Content */}
            <SidebarLayout>
              <Header
                title="Component Showcase"
                subtitle={`Responsive design on ${breakpoint} breakpoint`}
                actions={
                  <Inline gap="sm">
                    <div className="relative">
                      <Button variant="ghost" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <NotificationBadge count={3} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSheetOpen(true)}
                    >
                      Open Sheet
                    </Button>
                    <SidebarTrigger />
                  </Inline>
                }
              />

              <Main>
                <Container>
                  <SimpleTabs
                    tabs={tabsData}
                    defaultValue="overview"
                    variant="underline"
                    scrollable
                  />
                </Container>
              </Main>
            </SidebarLayout>
          </div>

          {/* Sheet Example */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} side="right" size="md">
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Device Configuration</SheetTitle>
                <SheetDescription>
                  Configure your audio device settings and preferences.
                </SheetDescription>
              </SheetHeader>

              <Stack gap="md">
                <InputComponent
                  label="Device Name"
                  placeholder="Enter device name"
                  fullWidth
                />
                <InputComponent
                  label="Sample Rate"
                  placeholder="48000"
                  fullWidth
                />
                
                <div>
                  <h4 className="font-medium mb-3">Audio Processing</h4>
                  <Stack gap="sm">
                    <Badge variant="success">Noise Suppression: Enabled</Badge>
                    <Badge variant="info">Echo Cancellation: Enabled</Badge>
                    <Badge variant="warning">Auto Gain: Disabled</Badge>
                  </Stack>
                </div>

                <Inline gap="sm" justify="end" className="pt-4">
                  <Button variant="outline" onClick={() => setSheetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setSheetOpen(false)}>
                    Save Changes
                  </Button>
                </Inline>
              </Stack>
            </SheetContent>
          </Sheet>
        </Layout>
      </SidebarProvider>
    </ToastProvider>
  );
};
