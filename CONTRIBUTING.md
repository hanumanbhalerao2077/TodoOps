# Contributing to TodoOps

Thank you for your interest in contributing to TodoOps! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment. We expect all contributors to:

- Be respectful and inclusive in all interactions
- Welcome constructive feedback
- Focus on collaboration and learning
- Report inappropriate behavior to maintainers

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/TodoOps.git
cd TodoOps
```

### 3. Set Up Development Environment

Follow the [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) guide for your operating system.

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming convention:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `chore/description` - Maintenance tasks
- `test/description` - Test additions

## Development Workflow

### 1. Make Your Changes

Make focused, atomic commits. Each commit should represent a logical unit of work.

### 2. Test Your Changes

```bash
# Frontend tests
cd client
npm run lint
npm run build

# Backend tests
cd ../server
npm run lint
npm test
```

### 3. Commit Your Changes

Follow [Commit Message Guidelines](#commit-message-guidelines).

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch and add a description
4. Ensure CI/CD checks pass

## Commit Message Guidelines

Use clear, descriptive commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Test additions or modifications
- `chore` - Maintenance and tooling
- `ci` - CI/CD configuration

### Scope

Optional scope indicating the area of change:
- `client` - Frontend changes
- `server` - Backend changes
- `docker` - Docker/containerization changes
- `k8s` - Kubernetes changes
- `ci` - CI/CD pipeline changes

### Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters

### Body

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

### Footer

Reference issues and breaking changes:
```
Fixes #123
Breaking change: Describe what changed
```

### Example

```
feat(api): add todo priority levels

- Add priority field to todo model
- Update API endpoints to include priority
- Implement priority-based sorting
- Add priority validation

Fixes #45
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines
- [ ] No unrelated changes included

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
Describe how to test these changes

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Commits follow guidelines
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Ensure CI/CD checks pass
4. PR will be merged once approved

## Coding Standards

### Frontend (React/JavaScript)

```javascript
// Use functional components with hooks
export const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  return (
    <div className="container">
      {/* JSX content */}
    </div>
  );
};

// Export components
export default MyComponent;
```

**Standards:**
- Use ES6+ syntax
- Prefer arrow functions
- Use functional components with hooks
- Add PropTypes or TypeScript types
- Keep components focused and reusable
- Use meaningful variable names

### Backend (Node.js/JavaScript)

```javascript
// Use async/await instead of callbacks
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export functions
module.exports = { getTodos };
```

**Standards:**
- Use async/await for asynchronous operations
- Implement error handling with try/catch
- Follow RESTful conventions
- Return consistent response formats
- Add input validation
- Log important events

### General

- Line length: 100 characters maximum
- Indentation: 2 spaces
- Semicolons: Required
- Trailing commas: Use in multiline objects/arrays
- Comments: Clear and concise, for "why" not "what"

## Testing

### Frontend Tests

```bash
cd client
npm test
```

Write tests for:
- Component rendering
- User interactions
- API calls
- State changes

### Backend Tests

```bash
cd server
npm test
```

Write tests for:
- API endpoints
- Database operations
- Error handling
- Input validation

### Test Coverage

Aim for:
- 80%+ code coverage
- Critical paths fully covered
- Edge cases tested

## Documentation

### Update Documentation For

- New features
- API changes
- Configuration changes
- Breaking changes
- Bug fixes (if related to undocumented behavior)

### Documentation Files

- **README.md** - Project overview
- **DEPLOYMENT.md** - Deployment instructions
- **ENVIRONMENT_SETUP.md** - Development setup
- **API_DOCUMENTATION.md** - API reference
- **K8S_DEPLOYMENT.md** - Kubernetes guide
- **CI_CD.md** - CI/CD pipeline documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Provide troubleshooting sections
- Link to related documentation

## Getting Help

- **Issues** - Report bugs or request features
- **Discussions** - Ask questions and discuss ideas
- **Documentation** - Check existing guides

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing to TodoOps! 🎉
