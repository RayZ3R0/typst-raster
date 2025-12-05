import { Route, Switch } from 'wouter';
import { Layout } from './components/Layout';
import { Introduction, Installation, QuickStart, Rendering, SnippetMode, Formats, Variables } from './pages/GettingStarted';
import { Batch, Caching, Streaming, Metadata, Errors, Api, Examples, Performance } from './pages/Advanced';

export function App() {
  return (
    <Layout>
      <Switch>
        {/* Getting Started */}
        <Route path="/" component={Introduction} />
        <Route path="/docs/installation" component={Installation} />
        <Route path="/docs/quick-start" component={QuickStart} />

        {/* Core Concepts */}
        <Route path="/docs/rendering" component={Rendering} />
        <Route path="/docs/snippet-mode" component={SnippetMode} />
        <Route path="/docs/formats" component={Formats} />
        <Route path="/docs/variables" component={Variables} />

        {/* Advanced */}
        <Route path="/docs/batch" component={Batch} />
        <Route path="/docs/caching" component={Caching} />
        <Route path="/docs/streaming" component={Streaming} />
        <Route path="/docs/metadata" component={Metadata} />
        <Route path="/docs/errors" component={Errors} />

        {/* Reference */}
        <Route path="/docs/api" component={Api} />
        <Route path="/docs/examples" component={Examples} />
        <Route path="/docs/performance" component={Performance} />

        {/* 404 */}
        <Route>
          <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-text-muted">Page not found</p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
