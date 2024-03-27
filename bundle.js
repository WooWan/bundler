//creating javascript bundler
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const parseModulesFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, { sourceType: "module" });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  return {
    filePath,
    dependencies,
    content,
  };
};

const buildDependencyGraph = (entry) => {
  const entryPath = path.resolve(entry);
  const mainModule = parseModulesFile(entryPath);

  const graph = [mainModule];
  const graphMap = {
    [mainModule.filePath]: mainModule,
  };

  while (graph.length) {
    const { dependencies } = graph.pop();

    dependencies.forEach((dependency) => {
      const dependencyPath = path.resolve(
        path.dirname(mainModule.filePath),
        dependency
      );
      const dependencyModule = parseModulesFile(dependencyPath);

      graphMap[dependencyModule.filePath] = dependencyModule;
      graph.push(dependencyModule);
    });
  }

  return graphMap;
};

const bundle = (entry, output) => {
  const modules = buildDependencyGraph(entry);
  let modulesContent = "";

  Object.values(modules).forEach((module) => {
    // Remove import statements for bundling
    const moduleContent = module.content.replace(
      /import\s.*?from\s['"](.+?)['"]/g,
      ""
    );
    modulesContent += `\n// Module: ${module.filePath}\n` + moduleContent;
  });

  fs.writeFileSync(output, modulesContent);
};

const entry = "./src/index.js";
const output = "./output.js";
bundle(entry, output);
