import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';

const TheoryReview = () => {
  return (
    <div className="py-2">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h4 className="fw-bold text-primary mb-3">
            📌 Tóm tắt cốt lõi về hook <code>useReducer</code>
          </h4>
          <p className="text-muted">
            <code>useReducer</code> là hook quản lý state nâng cao trong React, phù hợp khi state gồm nhiều giá trị phụ thuộc lẫn nhau hoặc có nhiều kiểu cập nhật phức tạp.
          </p>

          <Alert variant="info" className="mb-4">
            <strong>Luồng hoạt động 1 chiều:</strong>
            <div className="mt-2 font-monospace">
              User Action ➔ <code>dispatch(action)</code> ➔ <code>reducer(currentState, action)</code> ➔ <code>newState</code> ➔ Component re-render
            </div>
          </Alert>

          <h5 className="fw-bold mt-4 mb-3">1. So sánh <code>useState</code> vs <code>useReducer</code></h5>
          <Table responsive bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Tiêu chí</th>
                <th><code>useState</code></th>
                <th><code>useReducer</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cấu trúc State</strong></td>
                <td>Giá trị đơn lẻ, số, chuỗi, boolean</td>
                <td>Object nhiều trường hoặc mảng phức tạp</td>
              </tr>
              <tr>
                <td><strong>Số kiểu cập nhật</strong></td>
                <td>Ít (gán lại, toggle on/off)</td>
                <td>Nhiều (thêm, sửa, xóa, lọc, chuyển bước, reset...)</td>
              </tr>
              <tr>
                <td><strong>Vị trí Logic</strong></td>
                <td>Rải rác trong các hàm event handler</td>
                <td>Gom tập trung trong một hàm <code>reducer</code> duy nhất</td>
              </tr>
              <tr>
                <td><strong>Kiểm thử (Unit Test)</strong></td>
                <td>Cần render component</td>
                <td>Là hàm JavaScript thuần, kiểm thử trực tiếp không cần React</td>
              </tr>
              <tr>
                <td><strong>Khả năng mở rộng</strong></td>
                <td>Dễ rối khi state phình to</td>
                <td>Rất dễ mở rộng thêm action type mới mà không làm vỡ code cũ</td>
              </tr>
            </tbody>
          </Table>

          <h5 className="fw-bold mt-4 mb-3">2. Nguyên tắc &amp; Điều cấm kỵ trong Reducer</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <Card className="h-100 border-success bg-light">
                <Card.Header className="bg-success text-white fw-bold">
                  ✅ Được làm trong Reducer (Hàm thuần - Pure Function)
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0 ps-3">
                    <li>Đọc <code>state</code> và <code>action</code> hiện tại.</li>
                    <li>Tạo object / mảng mới bằng spread operator <code>...</code>, <code>map</code>, <code>filter</code>.</li>
                    <li>Thực hiện tính toán số học, kiểm tra điều kiện validation logic.</li>
                    <li>Trả về <code>state</code> gốc (cùng tham chiếu) nếu dữ liệu không hề thay đổi.</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="h-100 border-danger bg-light">
                <Card.Header className="bg-danger text-white fw-bold">
                  ❌ KHÔNG được làm trong Reducer
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0 ps-3">
                    <li>Sửa trực tiếp state (<code>state.count++</code>, <code>state.items.push()</code>).</li>
                    <li>Gọi API, tác vụ bất đồng bộ (<code>fetch</code>, <code>axios</code>, <code>setTimeout</code>).</li>
                    <li>Dùng <code>Math.random()</code>, <code>Date.now()</code>, <code>new Date()</code> (kết quả không tất định).</li>
                    <li>Gọi <code>dispatch</code>, <code>setState</code>, <code>localStorage</code>, <code>alert</code>.</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </div>

          <h5 className="fw-bold mt-4 mb-3">3. 10 Câu hỏi tự kiểm tra kiến thức</h5>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>1. Nêu 3 dấu hiệu cho thấy nên chuyển từ <code>useState</code> sang <code>useReducer</code>?</Accordion.Header>
              <Accordion.Body>
                <ol className="mb-0">
                  <li>Nhiều state luôn thay đổi cùng lúc trong một thao tác (ví dụ vừa tăng <code>count</code> vừa ghi vào mảng <code>history</code>).</li>
                  <li>Một thao tác phải gọi nhiều hàm <code>set</code> rời rạc, dễ quên hoặc sai thứ tự.</li>
                  <li>State mới phụ thuộc vào nhiều phần của state cũ, logic phân nhánh phức tạp.</li>
                </ol>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>2. Bốn khái niệm state, action, reducer, dispatch liên hệ với nhau thế nào?</Accordion.Header>
              <Accordion.Body>
                - <strong>State:</strong> Dữ liệu lưu trữ hiện thời.<br />
                - <strong>Action:</strong> Đối tượng mô tả điều vừa xảy ra (có thuộc tính <code>type</code> và tùy chọn <code>payload</code>).<br />
                - <strong>Dispatch:</strong> Hàm gửi action đến React.<br />
                - <strong>Reducer:</strong> Hàm thuần <code>(state, action) =&gt; newState</code> nhận action và state hiện tại để tính toán ra state mới.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>3. Vì sao reducer phải là hàm thuần? Kể 4 việc không được làm trong reducer?</Accordion.Header>
              <Accordion.Body>
                Reducer phải thuần để kết quả luôn tất định (cùng input thì ra cùng output), giúp React xác định đúng thay đổi render, hỗ trợ StrictMode, Time-travel Debugging. Bốn điều cấm: không mutate state trực tiếp, không gọi API/async, không dùng hàm sinh ngẫu nhiên/thời gian, không kích hoạt side-effects (alert, localStorage).
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>4. Muốn lưu thời điểm sự kiện xảy ra thì lấy thời gian ở đâu? Vì sao?</Accordion.Header>
              <Accordion.Body>
                Lấy thời gian trong <strong>hàm xử lý sự kiện (event handler)</strong> trước khi gửi action, rồi đưa vào <code>payload</code> (hoặc <code>action.at</code>). Tuyệt đối không gọi <code>new Date()</code> trong reducer vì reducer sẽ không còn thuần, và StrictMode gọi 2 lần sẽ sinh ra 2 mốc giờ khác nhau.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>5. Khi action không làm thay đổi gì, reducer nên trả về gì và có lợi ích gì?</Accordion.Header>
              <Accordion.Body>
                Nên <code>return state;</code> (trả về chính tham chiếu cũ). Khi React so sánh bằng <code>Object.is(oldState, newState)</code> thấy cùng tham chiếu, React sẽ bỏ qua lượt render (bailing out), tối ưu hiệu năng và không sinh ra bản ghi lịch sử thừa trong các bộ bọc Undo/Redo.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>6. <code>useReducer(reducer, arg, init)</code> khác <code>useReducer(reducer, init(arg))</code> ở điểm nào?</Accordion.Header>
              <Accordion.Body>
                - <code>useReducer(reducer, arg, init)</code>: Hàm <code>init(arg)</code> chỉ chạy duy nhất 1 lần khi component mount (lazy initialization).<br />
                - <code>useReducer(reducer, init(arg))</code>: Biểu thức <code>init(arg)</code> sẽ bị thực thi lại ở TẤT CẢ các lần render tiếp theo dù kết quả của nó bị React bỏ qua, gây lãng phí CPU nếu phép tính ban đầu nặng.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>7. Gọi <code>dispatch</code> ba lần liên tiếp trong một sự kiện, action thứ ba nhận state nào?</Accordion.Header>
              <Accordion.Body>
                React sẽ đưa 3 action vào hàng đợi và xử lý tuần tự qua hàm reducer. Action thứ 3 sẽ nhận vào state do action thứ 2 vừa tạo ra. Cuối cùng React gộp (batch) lại và chỉ kích hoạt 1 lần render duy nhất với state cuối cùng.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>8. Vì sao <code>&#123; type: &#39;setTasks&#39;, payload: newTasks &#125;</code> là thiết kế action không tốt?</Accordion.Header>
              <Accordion.Body>
                Vì nó biến reducer thành nơi gán giá trị thuần túy, đẩy toàn bộ logic tính toán state mới ngược về component. Cách tốt là mô tả <strong>sự kiện nghiệp vụ</strong> (ví dụ <code>tasks/moved</code>, <code>tasks/completed</code>) để reducer tự quản lý luật nghiệp vụ.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>9. Viết <code>undoable(reducer)</code> cần những phần nào trong state? Vì sao thao tác mới phải xóa <code>future</code>?</Accordion.Header>
              <Accordion.Body>
                Cần 3 phần: <code>&#123; past: [], present, future: [] &#125;</code>. Khi người dùng thực hiện một thao tác mới (sau khi vừa Undo), dòng thời gian bị rẽ nhánh, tương lai cũ (<code>future</code>) không còn hợp lệ nữa nên bắt buộc phải đặt lại <code>future: []</code>.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>10. Làm sao để nhiều component ở xa nhau cùng dùng chung một reducer?</Accordion.Header>
              <Accordion.Body>
                Kết hợp <code>useReducer</code> với <strong>React Context API</strong>. Đặt <code>[state, dispatch]</code> vào Context Provider ở component cha/gốc. Các component con ở bất kỳ cấp độ nào chỉ cần gọi <code>useContext</code> là có thể đọc <code>state</code> và gọi <code>dispatch(action)</code> mà không cần truyền props qua nhiều tầng (prop drilling).
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TheoryReview;
