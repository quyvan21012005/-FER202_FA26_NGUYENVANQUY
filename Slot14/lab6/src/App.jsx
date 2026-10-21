import AxiosDemo from './components/AxiosDemo';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import UpdatePost from './components/UpdatePost';
import PatchPost from './components/PatchPost';
import DeletePost from './components/DeletePost';
import RequestConfig from './components/RequestConfig';

function App() {
  return (
    <div className="container py-4">
      <AxiosDemo />
      <hr />
      <PostList />
      <hr />
      <CreatePost />
      <hr />
      <UpdatePost />
      <hr />
      <PatchPost />
      <hr />
      <DeletePost />
      <hr />
      <RequestConfig />
    </div>
  );
}

export default App;