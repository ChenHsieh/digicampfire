# Digital Campfire

A poetic web application that transforms daily news into personal poetry using the "Skinny poem" format. Users select from AI-transformed news headlines ("whispers"), choose an anchor word, share their feelings, and receive a generated 11-line poem.

## 🔥 What is Digital Campfire?

Digital Campfire is an experimental space where strangers gather to transform the noise of the world into poetry. Each day, we collect headlines from The Guardian and transform them into "whispers" — poetic phrases that capture emotional essence rather than literal facts.

## 📝 The Skinny Poem Format

A Skinny poem is a specific 11-line form:
- Line 1: The whisper (poetic phrase)
- Line 2: Your anchor word
- Lines 3-5: Single words building the image
- Line 6: Your anchor word (repeated)
- Lines 7-9: Single words continuing the image
- Line 10: Your anchor word (repeated)
- Line 11: The whisper (returned to)

## 🛠 Technical Architecture

### Core Components
- **Landing.tsx**: Multi-step poem creation interface
- **Display.tsx**: Poem presentation and sharing
- **RSS Parser**: Fetches and transforms Guardian headlines
- **OpenAI Integration**: Transforms headlines to poetry and generates poems

### Data Flow
1. Fetch RSS headlines from The Guardian
2. Transform headlines into poetic "whispers" using OpenAI
3. User selects whisper and anchor word
4. User optionally shares feelings
5. Generate Skinny poem using OpenAI GPT-4
6. Display poem with editing and sharing options

### External Dependencies
- **OpenAI API**: Headline transformation and poem generation
- **The Guardian RSS**: News source for daily whispers
- **CORS Proxy**: Enables RSS fetching in browser

## 🚀 Deployment & Environment

### Environment Variables Required
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Production Considerations
- Uses `corsproxy.io` for CORS-enabled RSS fetching
- Fallback systems for both news fetching and AI generation
- Client-side only - no data persistence
- Optimized build with code splitting

## 🔧 Troubleshooting

### Common Issues

#### 1. OpenAI API Not Working in Production
**Symptoms**: Poems use fallback generation, no AI transformation
**Causes**:
- Missing or incorrect `VITE_OPENAI_API_KEY` environment variable
- API key not properly set in Netlify environment variables
- Network restrictions blocking OpenAI API calls

**Solutions**:
1. Verify environment variable is set in Netlify dashboard
2. Check API key validity and billing status
3. Ensure API key has proper permissions
4. Check browser console for specific error messages

#### 2. News Fetching Fails
**Symptoms**: Using fallback whispers instead of real headlines
**Causes**:
- CORS proxy service down
- The Guardian RSS feed changes
- Network connectivity issues

**Solutions**:
1. Check if `corsproxy.io` is accessible
2. Try alternative CORS proxy services
3. Verify Guardian RSS feed URL is still valid
4. Check browser network tab for failed requests

#### 3. Deployment Issues
**Common Problems**:
- Build failures due to missing dependencies
- Environment variables not properly configured
- Static file serving issues

**Solutions**:
1. Ensure all dependencies are in package.json
2. Set environment variables in Netlify dashboard
3. Check build logs for specific errors
4. Verify netlify.toml configuration

### Debug Mode
Enable debug logging by checking browser console. The app logs:
- RSS fetching attempts and results
- OpenAI API calls and responses
- Fallback system activations
- Poem validation results

### Fallback Systems
The app includes robust fallback systems:
- **News Fetching**: Curated whispers if RSS fails
- **AI Generation**: Rule-based poem creation if OpenAI fails
- **Anchor Words**: Predefined list if generation fails

## 🏗 Development

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Key Files
- `src/utils/openai.ts`: AI integration and fallbacks
- `src/utils/rssParser.ts`: News fetching and transformation
- `src/components/Landing.tsx`: Main user interface
- `netlify.toml`: Production deployment configuration

## 🔒 Privacy

Digital Campfire is completely client-side:
- No data collection or storage
- Poems exist only in browser memory
- No user accounts or tracking
- Complete creative privacy

## 📄 License

This project is open source and available under the MIT License.