import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminHero from "@/pages/admin/Hero";
import AdminAbout from "@/pages/admin/About";
import AdminSkills from "@/pages/admin/Skills";
import AdminProjects from "@/pages/admin/Projects";
import AdminServices from "@/pages/admin/Services";
import AdminExperience from "@/pages/admin/Experience";
import AdminEducation from "@/pages/admin/Education";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminBlog from "@/pages/admin/Blog";
import AdminMessages from "@/pages/admin/Messages";
import AdminSettings from "@/pages/admin/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/contact" component={Contact} />
      <Route path="/services" component={Services} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/hero" component={AdminHero} />
      <Route path="/admin/about" component={AdminAbout} />
      <Route path="/admin/skills" component={AdminSkills} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/experience" component={AdminExperience} />
      <Route path="/admin/education" component={AdminEducation} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/settings" component={AdminSettings} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="dark min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
