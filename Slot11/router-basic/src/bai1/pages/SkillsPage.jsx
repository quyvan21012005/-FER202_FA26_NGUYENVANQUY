import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';

const SKILLS = [
  { name: 'ReactJS & React Router', level: 'Thành thạo', variant: 'primary', desc: 'SPA, Hooks, Routing, Context API' },
  { name: 'JavaScript (ES6+)', level: 'Thành thạo', variant: 'success', desc: 'Async/Await, Destructuring, Array Methods' },
  { name: 'HTML5 & CSS3', level: 'Thành thạo', variant: 'info', desc: 'Semantic tags, Flexbox, Grid, Responsive Design' },
  { name: 'Bootstrap & React-Bootstrap', level: 'Thành thạo', variant: 'warning', desc: 'Grid system, Utility classes, Components' },
  { name: 'Git & GitHub', level: 'Khá', variant: 'dark', desc: 'Version control, Git flow, Branching, Conventional Commits' },
  { name: 'Vite & Build Tools', level: 'Khá', variant: 'secondary', desc: 'Project scaffolding, Dev server, Optimization' },
];

const SkillsPage = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="mb-4">
            <h2 className="fw-bold">Kỹ năng chuyên môn</h2>
            <p className="text-muted">Các công nghệ và kỹ năng mình đã học và tích lũy trong quá trình học tập.</p>
          </div>

          <Card className="shadow-sm border-0">
            <ListGroup variant="flush">
              {SKILLS.map((skill, index) => (
                <ListGroup.Item key={index} className="p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-bold">{skill.name}</h5>
                    <small className="text-muted">{skill.desc}</small>
                  </div>
                  <Badge bg={skill.variant} pill className="px-3 py-2">
                    {skill.level}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SkillsPage;
