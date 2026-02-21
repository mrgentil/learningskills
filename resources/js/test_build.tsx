import React from 'react';
import { createRoot } from 'react-dom/client';

const Test = () => <div>Build Test</div>;

if (document.getElementById('landing-app')) {
    const root = createRoot(document.getElementById('landing-app'));
    root.render(<Test />);
}
