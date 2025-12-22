# Choose Your {{PRODUCT_NAME}}

This section contains information on {{PRODUCT_NAME}}'s deployment options, pricing plans, and licenses.

## Deployment Options

Depending on your use case and technical capabilities, {{PRODUCT_NAME}} offers multiple deployment options:

### Self-Hosted Deployment (Recommended)

**Recommended for production environments or customized use cases**

{{PRODUCT_NAME}} is designed for self-hosting, leveraging Elixir's distributed and high-concurrency advantages.

**Deployment Options**:

#### 1. **Docker Deployment** (Easiest)
```bash
docker run -d \
  -p 4000:4000 \
  -e DATABASE_URL=postgresql://user:pass@db/automation \
  automation/automation:latest
```

**Best for**:
- Quick testing and development
- Single-node deployment
- Teams familiar with Docker

#### 2. **Docker Compose Deployment** (Recommended for Getting Started)
Complete configuration files including PostgreSQL, Redis (optional), and other dependencies.

**Best for**:
- Production-grade deployment
- Orchestrating dependent services
- Small to medium teams

#### 3. **Kubernetes Deployment** (Enterprise Recommended)
Deploy using Helm Charts with support for high availability and auto-scaling.

```bash
helm repo add automation https://charts.automation.io
helm install automation automation/automation
```

**Best for**:
- Large-scale production environments
- High availability and elastic scaling needs
- Enterprises with existing K8s infrastructure

#### 4. **Source Code Deployment** (Advanced)
Build and run from source for deep customization.

```bash
git clone {{GITHUB_REPO_URL}}/automation.git
cd automation
mix deps.get
mix ecto.migrate
iex -S mix phx.server
```

**Best for**:
- Deep customization needs
- Code contributions
- Elixir developers

### Cloud-Hosted Version (Coming Soon)

**{{PRODUCT_NAME}} Cloud** is under development and will offer:
- Fully managed service with no operations overhead
- Automatic backups and monitoring
- Global CDN acceleration
- Enterprise-grade SLA guarantees

Expected launch: **Q2 2025**. Stay tuned!

## Self-Hosting Technical Requirements

:::warning Prerequisites
Self-hosting {{PRODUCT_NAME}} requires technical knowledge, including:

- Server and container setup and configuration
- Application resource management and scaling
- Server and application security hardening
- {{PRODUCT_NAME}} configuration and tuning
- Basic Elixir/Phoenix knowledge (optional but helpful)

We recommend self-hosting for users with operations experience. Misconfigurations can lead to data loss, security issues, and downtime.

If you lack server management experience, consider waiting for **{{PRODUCT_NAME}} Cloud**.
:::

## System Requirements

### Minimum Configuration (Development/Testing)
- **CPU**: 2 cores
- **Memory**: 4GB RAM
- **Storage**: 20GB SSD
- **OS**: Linux (Ubuntu 20.04+, Debian 11+, RHEL 8+)

### Recommended Configuration (Production)
- **CPU**: 4+ cores
- **Memory**: 8GB+ RAM
- **Storage**: 50GB+ SSD
- **OS**: Linux (Ubuntu 22.04 LTS recommended)
- **Database**: PostgreSQL 14+ (dedicated server)

### High Availability Configuration (Enterprise)
- **App Nodes**: 3+ nodes, 8 cores 16GB+ each
- **Database**: PostgreSQL with replication or clustering
- **Load Balancer**: Nginx/HAProxy
- **Storage**: Distributed storage or NFS
- **Monitoring**: Prometheus + Grafana

## Licensing

{{PRODUCT_NAME}} uses the **Sustainable Use License**, a fair-code licensing model.

### 📜 License Model Explanation

**What is the Sustainable Use License?**

A license that balances openness and sustainability:
- ✅ **Fully open source code** - Auditable, modifiable, learnable
- ✅ **Free for internal use** - Unlimited enterprise internal deployment
- ✅ **Allows derivatives** - Modify and integrate into your products
- ❌ **No multi-tenant SaaS** - Cannot resell as hosted service (requires commercial license)
- ❌ **No removing branding** - Must retain {{PRODUCT_NAME}} branding in frontend (commercial license allows removal)

**Why this license?**

We aim to balance openness and sustainability:
- Prevent large companies from directly competing with hosted SaaS using our code
- Allow enterprises to self-host and integrate
- Ensure long-term project development and maintenance
- Follow [Fair Code](https://faircode.io) principles

Full license details: [LICENSE.md]({{GITHUB_REPO_URL}}/blob/main/LICENSE.md)

### Open Source Edition (Sustainable Use License)

**Completely free** for:
- ✅ Personal use and learning
- ✅ Enterprise internal deployment (for your employees)
- ✅ Integration into your product (non-SaaS)
- ✅ Open source projects
- ✅ Non-commercial use

**Included Features**:
- ✅ Complete AI Agent framework
- ✅ Visual workflow editor
- ✅ High-performance Elixir runtime
- ✅ Expression engine
- ✅ All official plugins
- ✅ Community support

**Usage Restrictions**:
- ❌ Cannot operate multi-tenant SaaS (e.g., "AI Agent Platform as a Service")
- ❌ Cannot remove {{PRODUCT_NAME}} branding from frontend UI
- ⚠️ Enterprise features (`.ee.` marked code) require commercial license

### Enterprise Edition (Enterprise License)

For large teams and enterprise scenarios, commercial licensing unlocks additional capabilities:

**Commercial License Unlocks**:
- 🔓 **Multi-tenant SaaS rights** - Operate hosted services
- 🔓 **White-labeling** - Remove {{PRODUCT_NAME}} branding
- 🔓 **Core engine commercial use** - Integrate Agent Runtime into commercial products

**Enterprise Features** (`.ee.` files in codebase):
- 🔒 **Single Sign-On (SSO)** - SAML 2.0, OAuth 2.0, LDAP
- 🔒 **Advanced RBAC** - Fine-grained access control
- 🔒 **Audit Logs** - Complete operation tracking and compliance reporting
- 🔒 **Approval Workflows** - Multi-level approval processes
- 🔒 **High Availability Clustering** - Multi-node deployment and failover
- 🔒 **Priority Technical Support** - SLA guarantees
- 🔒 **Dedicated Customer Success Manager**
- 🔒 **Custom Development Services**

**Pricing**:
- Custom pricing based on team size and requirements
- Contact us for a quote: [{{SALES_EMAIL}}](mailto:{{SALES_EMAIL}})

## Pricing Comparison

| Feature | Open Source | Enterprise |
|---------|-------------|------------|
| **Core Features** |
| AI Agent Framework | ✅ | ✅ |
| Visual Editor | ✅ | ✅ |
| Expression Engine | ✅ | ✅ |
| Official Plugins | ✅ | ✅ |
| Self-Hosted Deployment | ✅ | ✅ |
| **Team Collaboration** |
| Multi-User Support | ✅ | ✅ |
| Basic Permission Management | ✅ | ✅ |
| Version Control | ✅ | ✅ |
| **Enterprise Features** |
| SSO Integration | ❌ | ✅ |
| Advanced RBAC | ❌ | ✅ |
| Audit Logs | ❌ | ✅ |
| Approval Workflows | ❌ | ✅ |
| **Support Services** |
| Community Support | ✅ | ✅ |
| Email Support | ❌ | ✅ |
| Priority Support | ❌ | ✅ |
| SLA Guarantee | ❌ | ✅ |
| Dedicated CSM | ❌ | ✅ |
| **Cost** |
| Price | **Free** | **Contact Sales** |

## How to Choose?

### Choose Open Source if you:
- 🎯 Are an individual developer or small team
- 🎯 Have budget constraints
- 🎯 Have your own operations team
- 🎯 Don't need enterprise features
- 🎯 Are comfortable with community support

### Choose Enterprise if you:
- 🎯 Are a medium to large enterprise (50+ employees)
- 🎯 Need SSO integration
- 🎯 Have strict compliance requirements (audit logs)
- 🎯 Need professional technical support
- 🎯 Need custom development
- 🎯 Run mission-critical applications requiring SLA

### Wait for Cloud-Hosted if you:
- 🎯 Don't want to manage servers
- 🎯 Need quick deployment
- 🎯 Are a small team without dedicated operations
- 🎯 Need global acceleration and high availability

## Migration Paths

### Upgrading from Open Source to Enterprise
Seamless upgrade, just:
1. Contact us for an enterprise license
2. Update configuration files
3. Restart services
4. No data migration required

### Migrating from Self-Hosted to Cloud (Future)
We will provide:
- One-click migration tools
- Data export/import wizards
- Migration technical support

## Getting Help

### Community Support
- [GitHub Discussions]({{GITHUB_REPO_URL}}/discussions) - Ask questions and discuss
- [Discord Community]({{DISCORD_URL}}) - Real-time chat
- [Documentation](/en/guide/) - Complete usage documentation

### Enterprise Support
- **Sales Inquiries**: [{{SALES_EMAIL}}](mailto:{{SALES_EMAIL}})
- **Technical Support**: [{{SUPPORT_EMAIL}}](mailto:{{SUPPORT_EMAIL}})
- **Partnerships**: [{{PARTNER_EMAIL}}](mailto:{{PARTNER_EMAIL}})

## FAQ

### Are there usage limits in the open source edition?
No! The open source edition has full features with no limits on node count, execution frequency, or user count.

### Can I upgrade from open source to enterprise?
Yes, seamless upgrade with full data compatibility.

### Which databases are supported?
PostgreSQL 14+ is recommended. MySQL 8.0+ is also supported.

### Is Redis required?
Not required. Elixir has built-in ETS caching, sufficient for small deployments. Redis is optional for large-scale deployments to boost performance.

### When will the cloud-hosted version launch?
Expected Q2 2025. Join the [early access program](https://automation.io/cloud-waitlist) for priority access.

### Does it support private deployment?
Absolutely! Both open source and enterprise editions can be deployed in your private environment (on-premises servers, private cloud, VPC).

---

Ready to get started?

👉 Visit the [GitHub Repository]({{GITHUB_REPO_URL}}) to deploy your {{PRODUCT_NAME}} platform!
