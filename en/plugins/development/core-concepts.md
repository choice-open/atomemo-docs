---
title: Core Concepts of Plugin Development
description: Understand the core concepts related to plugin development
---

# {{ $frontmatter.title }}

Workflows can integrate various features from different services. Although {{ PRODUCT_NAME }} provides built-in support for many features, it cannot cover everything. The goal of the plugin system is to extend the workflow's ability to support more external services and features. In fact, some of {{ PRODUCT_NAME }}'s built-in features are implemented as plugins.

Third-party developers can also easily use the plugin system to provide more features for workflows. Therefore, understanding the composition and working mechanism of the plugin system is crucial for plugin development.

## Main Components of the Plugin System

### Host Service

Plugins can be developed and run independently, but without the host service that drives them, plugins would be useless. Here, the host service refers to the {{ PRODUCT_NAME }} application itself. In the plugin system, the host service has two main roles:

1. Provide a graphical user interface that allows users to search for and install various plugins, and integrate and configure plugins in workflows.
2. When a workflow runs, actively call the plugins and obtain the results after plugin execution, or provide the ability to allow plugins to make reverse calls to the system.

### Plugin Hub

Plugins and host services can call each other bidirectionally, but they don't directly interact. They exchange information through an intermediary service called the "Plugin Hub".

::: details Why can't plugins and the host interact directly?

From the user's perspective, this is to ensure security: plugin code is written by third parties, and if it could freely interact with the host, there would be a risk of data leakage. The Hub in the middle constrains the communication protocol between plugins and the host, so plugins can only pass information with restrictions.

From the plugin's perspective, this ensures flexibility for third-party developers writing plugins. If the host directly interacted with plugins, it would need to limit plugin capabilities to avoid producing responses that the host cannot handle. With the Hub coordinating information exchange between both parties, the coupling between input/output and actual code logic is eliminated, making it more developer-friendly.

:::

### Command Line Tool and SDK

Although the plugin system's design itself is complex and intricate, fortunately, plugin developers don't need to deeply study how it works. This is because {{ PRODUCT_NAME }} provides a command-line tool and SDK. With their assistance, you can focus on the plugin's functionality without worrying about how to "interact" with the host service:

1. [Command Line Tool](./cli): Quickly create plugin projects, run them locally with automatic connection to the Hub and message transmission. After plugin development is complete, it handles the final stage of building, packaging, and uploading for release. The entire development workflow can be easily managed through the command-line tool.
2. [SDK](./sdk): Encapsulates definitions of various types of plugins and protocol interfaces for bidirectional communication with the Hub/host. It also provides various peripheral ecosystems related to plugin project development, such as internationalization support, logging output, lifecycle hooks and callbacks, and more.

## How to Get Started and Master Plugin Development Techniques?

After understanding the above core concepts, you're ready to start writing plugin code. {{ PRODUCT_NAME }} provides developers with multi-faceted technical support:

1. Read [Quick Start](./quick-start) and follow the tutorial to create a tool plugin in just ten minutes, quickly experiencing the ease and joy of plugin development.
2. Browse the [official plugin source code](https://github.com/choice-open/atomemo-official-plugins) already listed in the [Official Marketplace](.), and learn development techniques for various types of plugins.
3. Visit the [Official Discussion Forum](https://github.com/choice-open/atomemo-official-plugins/discussions) or join the [Discord Channel](https://discord.gg/U3vj73yvwp) to discuss plugin development and seek more help.
