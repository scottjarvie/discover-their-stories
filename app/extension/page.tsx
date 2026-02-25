import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { 
  Download, 
  Chrome, 
  CheckCircle2, 
  ArrowRight, 
  FileJson, 
  Shield,
  Clock,
  MousePointer,
  Upload
} from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Extension",
  description:
    "Install the FamilySearch Source Extractor extension and import evidence packs into Discover Their Stories.",
  path: "/extension",
});

export default function ExtensionPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Chrome className="w-3 h-3 mr-1" />
            Chrome Extension
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            FamilySearch Source Extractor
          </h1>
          <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            Extract all source documentation from any FamilySearch person page with one click. 
            Captures indexed information, citations, and attachments automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-700 hover:bg-amber-800" asChild>
              <a href="/extension-download/discover-their-stories-extension.zip" download>
                <Download className="w-5 h-5 mr-2" />
                Download Extension
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#installation">
                View Installation Guide
              </a>
            </Button>
          </div>
          
          <p className="text-sm text-stone-500 mt-4">
            Version 1.0.0 • Chrome / Edge / Brave supported
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Review our{" "}
            <Link href="/privacy" className="text-amber-700 hover:underline">
              Privacy Policy
            </Link>{" "}
            before running extractions.
          </p>
        </div>
      </section>

      {/* What It Does */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What It Does</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <MousePointer className="w-6 h-6 text-amber-700" />
                </div>
                <CardTitle>One-Click Extraction</CardTitle>
                <CardDescription>
                  Navigate to any FamilySearch person&apos;s sources page, click the extension, 
                  and it automatically extracts all source data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                </div>
                <CardTitle>Expands Indexed Info</CardTitle>
                <CardDescription>
                  Automatically clicks &quot;Show Indexed Information&quot; on each source to capture 
                  the detailed fields that are normally hidden.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileJson className="w-6 h-6 text-blue-700" />
                </div>
                <CardTitle>Creates Evidence Pack</CardTitle>
                <CardDescription>
                  Generates a structured JSON file containing all extracted data—ready 
                  to import into Discover Their Stories for AI analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-700" />
                </div>
                <CardTitle>Respectful Pacing</CardTitle>
                <CardDescription>
                  Built-in delays between operations ensure compliance with FamilySearch&apos;s 
                  terms of use. No bulk scraping—user-initiated only.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-stone-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">
            From FamilySearch to AI-powered insights in four simple steps
          </p>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Navigate to Sources Page",
                description: "Go to any FamilySearch person's sources page. The URL will look like: familysearch.org/tree/person/sources/XXXX-XXX",
                icon: Chrome,
              },
              {
                step: 2,
                title: "Click Extract",
                description: "Click the extension icon, check the consent box, and click 'Extract Sources'. Watch as it processes each source.",
                icon: MousePointer,
              },
              {
                step: 3,
                title: "Download Evidence Pack",
                description: "Once complete, download the JSON file or copy it to your clipboard. This contains all the extracted source data.",
                icon: Download,
              },
              {
                step: 4,
                title: "Import into App",
                description: "Open Discover Their Stories, go to Source Documentation, and import your Evidence Pack. Now you can generate documents!",
                icon: Upload,
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-white p-6 rounded-lg border">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-stone-600 break-all">{item.description}</p>
                </div>
                <item.icon className="w-6 h-6 text-stone-400 flex-shrink-0 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="installation" className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Installation Guide</h2>
          <p className="text-center text-stone-600 mb-12">
            Install in Chrome, Edge, or Brave in under 2 minutes
          </p>

          <div className="bg-stone-50 rounded-xl p-8 border">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Download the Extension</h3>
                  <p className="text-stone-600 mb-3">
                    Click the download button above to get the extension ZIP file. 
                    Extract it to a folder you&apos;ll remember (e.g., your Documents folder).
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/extension-download/discover-their-stories-extension.zip" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download ZIP
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Open Chrome Extensions</h3>
                  <p className="text-stone-600 mb-3">
                    Open Chrome and navigate to the extensions page:
                  </p>
                  <code className="block bg-stone-800 text-stone-100 px-4 py-2 rounded text-sm">
                    chrome://extensions/
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Enable Developer Mode</h3>
                  <p className="text-stone-600">
                    Toggle <strong>&quot;Developer mode&quot;</strong> ON in the top-right corner of the extensions page.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Load the Extension</h3>
                  <p className="text-stone-600 mb-3">
                    Click <strong>&quot;Load unpacked&quot;</strong> and select the extracted extension folder. 
                    You should see &quot;Discover Their Stories - Source Extractor&quot; appear!
                  </p>
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Look for the orange &quot;T&quot; icon in your toolbar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 bg-stone-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Details</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-amber-700 mb-2" />
                <CardTitle className="text-lg">Pacing</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-stone-600">
                <ul className="space-y-1">
                  <li>• 1 second delay between sources</li>
                  <li>• 500ms after each click action</li>
                  <li>• Max 50 sources per extraction</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileJson className="w-8 h-8 text-amber-700 mb-2" />
                <CardTitle className="text-lg">Data Captured</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-stone-600">
                <ul className="space-y-1">
                  <li>• Source titles & citations</li>
                  <li>• Indexed fields (name, date, place)</li>
                  <li>• Attachments & tags</li>
                  <li>• Record links & contributor info</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-amber-700 mb-2" />
                <CardTitle className="text-lg">Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-stone-600">
                <ul className="space-y-1">
                  <li>• No data sent to external servers</li>
                  <li>• All processing happens locally</li>
                  <li>• You control the exported file</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-amber-100 mb-8 max-w-xl mx-auto">
            Download the extension, extract your first Evidence Pack, and let AI help you 
            document your family history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50" asChild>
              <a href="/extension-download/discover-their-stories-extension.zip" download>
                <Download className="w-5 h-5 mr-2" />
                Download Extension
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-amber-600" asChild>
              <Link href="/app/source-docs">
                Open Source Docs Tool
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
