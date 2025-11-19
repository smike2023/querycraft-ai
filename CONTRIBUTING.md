# Contributing to QueryCraft AI

Thank you for considering contributing to QueryCraft AI! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, Node version)

### Suggesting Features

We love new ideas! Open an issue with:
- Clear description of the feature
- Why it would be useful
- How it should work
- Examples or mockups (if applicable)

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/querycraft-ai.git
   cd querycraft-ai
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/querycraft-ai.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic

2. **Test your changes**
   ```bash
   pnpm dev  # Test locally
   pnpm build  # Ensure it builds
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Describe what you changed and why
   - Link any related issues

#### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Use functional components and hooks
- **Naming**:
  - Components: `PascalCase`
  - Functions: `camelCase`
  - Constants: `UPPER_CASE`
  - Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities

- **File Organization**:
  ```
  src/
    components/     # Reusable UI components
    pages/         # Page components (tools)
    lib/           # Utilities, types, configs
    hooks/         # Custom React hooks
  ```

- **Formatting**: Use Prettier (automatic on save)

#### What We're Looking For

**High Priority**:
- Bug fixes
- Performance improvements
- Documentation improvements
- Test coverage
- Accessibility enhancements

**Feature Ideas**:
- New query templates
- Additional MongoDB operators
- UI/UX improvements
- Export format options
- Mobile responsiveness

**Edge Functions**:
- If adding new tools, create corresponding Edge Functions
- Include error handling and input validation
- Add authentication checks

### Pull Request Process

1. **PR Checklist**:
   - [ ] Code builds without errors (`pnpm build`)
   - [ ] No TypeScript errors
   - [ ] Tested locally
   - [ ] Documentation updated (if needed)
   - [ ] Commit messages follow convention

2. **Review Process**:
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, it will be merged

3. **After Merge**:
   - Your contribution will be in the next release
   - You'll be added to the contributors list

## Development Setup

### Required Tools
- Node.js 18+
- pnpm (package manager)
- Git
- VS Code (recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- GitHub Pull Requests

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Running Tests
```bash
# Coming soon
pnpm test
```

## Questions?

- Open an issue for questions
- Join our discussions on GitHub
- Check existing issues and PRs first

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to QueryCraft AI! 🚀
