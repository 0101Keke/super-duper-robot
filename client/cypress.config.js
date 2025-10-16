// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        env: {
            apiUrl: 'http://localhost:5000/api'
        },
        video: true,
        screenshotOnRunFailure: true,
        viewportWidth: 1280,
        viewportHeight: 720
    },
});