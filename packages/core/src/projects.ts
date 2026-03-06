import type { Storage } from './storage.js';
import type {
  CreateProjectOptions,
  ConfigureProjectOptions,
  Project,
} from './types.js';
import type { ProjectsNamespace } from './client.js';
import { DEFAULT_FEATURES } from './config.js';

// ---------------------------------------------------------------------------
// Key helpers
// ---------------------------------------------------------------------------

const PROJECT_PREFIX = 'project:';

function projectKey(name: string): string {
  return `${PROJECT_PREFIX}${name}`;
}

// ---------------------------------------------------------------------------
// Serialization (handles Date fields)
// ---------------------------------------------------------------------------

function serialize(project: Project): string {
  return JSON.stringify(project);
}

function deserialize(json: string): Project {
  const raw = JSON.parse(json);
  return { ...raw, createdAt: new Date(raw.createdAt) };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `ProjectsNamespace` backed by the given Storage.
 *
 * Each project is persisted as a JSON string under the key `project:<name>`.
 */
export function createProjectsNamespace(storage: Storage): ProjectsNamespace {
  return {
    async create(options: CreateProjectOptions): Promise<Project> {
      const existing = await storage.get(projectKey(options.name));
      if (existing) {
        throw new Error(`Project "${options.name}" already exists`);
      }

      const project: Project = {
        name: options.name,
        region: options.region ?? 'us',
        features: { ...DEFAULT_FEATURES, ...options.features },
        createdAt: new Date(),
      };

      await storage.set(projectKey(options.name), serialize(project));
      return project;
    },

    async get(name: string): Promise<Project> {
      const data = await storage.get(projectKey(name));
      if (!data) {
        throw new Error(`Project "${name}" not found`);
      }
      return deserialize(data);
    },

    async list(): Promise<Project[]> {
      const keys = await storage.list(PROJECT_PREFIX);
      const projects: Project[] = [];
      for (const key of keys) {
        const data = await storage.get(key);
        if (data) {
          projects.push(deserialize(data));
        }
      }
      return projects.sort((a, b) => a.name.localeCompare(b.name));
    },

    async configure(
      name: string,
      options: ConfigureProjectOptions,
    ): Promise<Project> {
      const data = await storage.get(projectKey(name));
      if (!data) {
        throw new Error(`Project "${name}" not found`);
      }
      const project = deserialize(data);

      if (options.features) {
        project.features = { ...project.features, ...options.features };
      }
      if (options.region) {
        project.region = options.region;
      }

      await storage.set(projectKey(name), serialize(project));
      return project;
    },

    async delete(name: string): Promise<void> {
      const data = await storage.get(projectKey(name));
      if (!data) {
        throw new Error(`Project "${name}" not found`);
      }
      await storage.delete(projectKey(name));
    },
  };
}
