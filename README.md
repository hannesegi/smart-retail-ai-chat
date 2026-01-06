# TokoGPT Chat

This is a Next.js starter project for Firebase Studio that provides an AI-powered grocery assistant called TokoGPT.

## Overview

TokoGPT is a versatile AI assistant designed for both online and offline shopping experiences. It helps users with product discovery, location, and knowledge, whether they are in a supermarket or browsing from home.

### Login Page

![Login Page](./public/img/page1.png)

### Chat Interface

![Chat Interface](./public/img/page2.png)


## Getting Started

### Installation

To get started with the project, you first need to install the necessary dependencies using npm. Open your terminal in the project's root directory and run the following command:

```bash
npm install
```

This will download and install all the packages defined in the `package.json` file.

### Running the Development Environment

The application consists of two main parts: the Next.js frontend and the Genkit AI flows backend. You'll need to run both concurrently in separate terminal sessions.

**1. Start the Next.js Development Server:**

In your first terminal, run:

```bash
npm run dev
```

This will start the main web application, which you can access at [http://localhost:9002](http://localhost:9002).

**2. Start the Genkit Flow Server:**

In a second terminal, run:

```bash
npm run genkit:dev
```

This command starts the Genkit development UI, which you can use to inspect, test, and monitor your AI flows.

## Creating a New AI Flow

Genkit flows are the backbone of the AI functionality in this application. To create a new flow, follow these steps:

1.  **Create a new flow file:**
    Inside the `src/ai/flows/` directory, create a new TypeScript file (e.g., `my-new-flow.ts`).

2.  **Define the flow:**
    In your new file, use `ai.defineFlow()` to define the logic for your AI agent. You should also define the input and output schemas using Zod for type safety and validation. Here is a basic template:

    ```typescript
    'use server';

    import {ai} from '@/ai/genkit';
    import {z} from 'genkit';

    // 1. Define input schema
    const MyFlowInputSchema = z.object({
      inputText: z.string(),
    });

    // 2. Define output schema
    const MyFlowOutputSchema = z.object({
      outputText: z.string(),
    });
    
    // 3. (Optional) Define a prompt
    const myPrompt = ai.definePrompt({
        name: 'myNewPrompt',
        input: { schema: MyFlowInputSchema },
        output: { schema: MyFlowOutputSchema },
        prompt: `Take the following text and reverse it: {{{inputText}}}`
    });

    // 4. Define the flow
    const myNewFlow = ai.defineFlow(
      {
        name: 'myNewFlow',
        inputSchema: MyFlowInputSchema,
        outputSchema: MyFlowOutputSchema,
      },
      async (input) => {
        const { output } = await myPrompt(input);
        return output!;
      }
    );

    // 5. Export a wrapper function to call the flow
    export async function runMyNewFlow(input: z.infer<typeof MyFlowInputSchema>): Promise<z.infer<typeof MyFlowOutputSchema>> {
        return myNewFlow(input);
    }
    ```

3.  **Register the new flow:**
    Open `src/ai/dev.ts` and add an import statement for your new flow file. This makes it available to the Genkit development server.

    ```typescript
    // src/ai/dev.ts
    import '@/ai/flows/my-new-flow.ts';
    // ... other imports
    ```

4.  **Use the flow in your application:**
    Finally, you can import and call your exported wrapper function (`runMyNewFlow` in this example) from your server-side components or actions (e.g., in `src/app/actions.tsx`) to integrate the new AI capability into your app.
