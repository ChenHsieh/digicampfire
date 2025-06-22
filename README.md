# Digital Campfire 🔥

A poetic web application that transforms today's news into contemplative "Skinny poems" - a unique 11-line poetry format that creates space for reflection and emotional processing.

## ✨ Features

- **News-to-Poetry Transformation**: Converts current headlines into poetic whispers using AI
- **Interactive Poem Creation**: 3-step guided process to create personalized Skinny poems
- **Dynamic Campfire Orb**: Beautiful animated centerpiece with random colors and responsive effects
- **Poem Editing**: Curator mode for fine-tuning your verses
- **Sharing Options**: Copy to clipboard or share via email
- **Responsive Design**: Works beautifully on all devices

## 🎨 Design Philosophy

Digital Campfire embraces "apple-level design aesthetics" with:
- Subtle animations and micro-interactions
- Sophisticated color palettes with random orb colors
- Typography hierarchy using EB Garamond and Courier Prime
- Glassmorphism effects with backdrop blur
- Thoughtful spacing and visual balance

## 🏗️ Architecture

### Core Components

- **`Landing.tsx`**: Main interface for poem creation workflow
- **`Display.tsx`**: Poem presentation and editing interface
- **`BoltLogo.tsx`**: Branding component

### Utilities

- **`openai.ts`**: AI integration for poem generation and headline transformation
- **`rssParser.ts`**: RSS feed parsing with multiple CORS proxy fallbacks
- **`helpers.ts`**: Shared utility functions for colors and fallbacks

### Key Features

- **Skinny Poem Format**: 11-line structure with specific anchor word placement
- **RSS Integration**: Real-time news headlines from The Guardian
- **AI Enhancement**: GPT-4 powered poem generation with validation
- **Fallback Systems**: Graceful degradation when external services fail

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

## 🎯 How It Works

### The Skinny Poem Format

A Skinny poem follows this structure:
- Line 1: Opening whisper (poetic phrase)
- Line 2: Anchor word
- Lines 3-5: Single words
- Line 6: Anchor word (repeated)
- Lines 7-9: Single words
- Line 10: Anchor word (repeated)
- Line 11: Closing whisper (variation of line 1)

### Creation Process

1. **Choose a Whisper**: Select from AI-transformed news headlines
2. **Pick an Anchor**: Choose a word that will anchor your poem
3. **Share Your Feeling**: Optional emotional context
4. **Generate**: AI creates your personalized Skinny poem

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **AI**: OpenAI GPT-4 and GPT-3.5-turbo
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🎨 Visual Enhancements

### Campfire Orb
- Random color generation on load and hover
- Subtle mouse-following movement (reduced sensitivity)
- Enhanced pulsing effects that strengthen on hover
- Multiple animation layers for realistic campfire feel

### Color System
- 6 predefined color palettes for orb variations
- Consistent 8px spacing system
- Comprehensive color ramps for UI elements
- High contrast ratios for accessibility

## 🔧 Configuration

### Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key for poem generation

### RSS Sources

The app fetches headlines from The Guardian's World RSS feed with multiple CORS proxy fallbacks for reliability.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🌟 Future Enhancements

- Database integration for poem storage and sharing
- User accounts and poem collections
- Community features for shared campfire experiences
- Additional news sources and languages
- Mobile app version

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Bolt](https://bolt.new) - AI-powered development platform
- News content sourced from The Guardian
- Powered by OpenAI's language models
- Typography by Google Fonts (EB Garamond, Courier Prime)

---

*"A space for strangers to sit by and share one line of feeling"*