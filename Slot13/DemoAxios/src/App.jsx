import React from 'react';
import NC1_AsyncAwait from './components/NC1_AsyncAwait';
import NC3_PostDetail from './components/NC3_PostDetail';
import NC4_AbortRequest from './components/NC4_AbortRequest';
import NC5_BootstrapCRUD from './components/NC5_BootstrapCRUD';
import NC8_CustomHookDemo from './components/NC8_CustomHookDemo';

function App() {
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Phần 3: Yêu cầu nâng cao (Advanced Axios)</h2>
      <NC1_AsyncAwait />
      <NC3_PostDetail />
      <NC4_AbortRequest />
      <NC5_BootstrapCRUD />
      <NC8_CustomHookDemo />
    </div>
  );
}

export default App;