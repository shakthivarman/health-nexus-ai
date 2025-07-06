# Health Nexus AI - Azure App Service Deployment Guide

This guide provides step-by-step instructions for deploying the Health Nexus AI application with Azure Foundry agents to Azure App Service.

## Prerequisites

1. **Azure CLI** - Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
2. **Node.js 18+** - The application requires Node.js 18 or higher
3. **Azure Subscription** - You need an active Azure subscription
4. **Git** (optional) - For version control and CI/CD

## Quick Deployment

### Option 1: Automated Script Deployment

Run the automated deployment script:

```bash
./deploy-to-azure.sh
```

This script will:
- Create Azure resources (Resource Group, App Service Plan, Web App)
- Configure the runtime environment
- Build and deploy the application
- Set up environment variables
- Provide the application URL

### Option 2: Manual Azure CLI Deployment

1. **Login to Azure**
   ```bash
   az login
   ```

2. **Use Existing Resource Group**
   ```bash
   # Using existing resource group: ODL-Infosys-Hack-1775376-09
   ```

3. **Create App Service Plan**
   ```bash
   az appservice plan create \
     --name health-nexus-ai-plan \
     --resource-group ODL-Infosys-Hack-1775376-09 \
     --sku B1 \
     --is-linux
   ```

4. **Create Web App**
   ```bash
   az webapp create \
     --resource-group ODL-Infosys-Hack-1775376-09 \
     --plan health-nexus-ai-plan \
     --name health-nexus-ai-app \
     --runtime "NODE|18-lts"
   ```

5. **Configure Startup Command**
   ```bash
   az webapp config set \
     --resource-group ODL-Infosys-Hack-1775376-09 \
     --name health-nexus-ai-app \
     --startup-file "node server.js"
   ```

6. **Build and Deploy**
   ```bash
   npm run build
   zip -r deploy.zip . -x "node_modules/*" ".git/*"
   az webapp deployment source config-zip \
     --resource-group ODL-Infosys-Hack-1775376-09 \
     --name health-nexus-ai-app \
     --src deploy.zip
   ```

### Option 3: GitHub Actions CI/CD

1. **Set up GitHub repository** with your code
2. **Create Azure Service Principal**
   ```bash
   az ad sp create-for-rbac --name "health-nexus-ai-github-actions" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/ODL-Infosys-Hack-1775376-09 --sdk-auth
   ```

3. **Add GitHub Secrets**
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure Portal
   - `AZURE_CREDENTIALS`: Output from step 2

4. **Use the provided workflow** (`azure-deploy.yml`) in `.github/workflows/`

## Application Configuration

The application comes pre-configured with:

### Azure Foundry Agents
- **Radiology Agent**: Medical imaging analysis
- **Pathology Agent**: Tissue analysis
- **Genomic Agent**: Genetic analysis
- **Lab Results Agent**: Laboratory data interpretation
- **Orchestrator Agent**: Multi-agent coordination

### Mock Data Configuration
- All agents use realistic mock data for demonstration
- No real Azure AI services required for initial deployment
- Comprehensive health scenarios pre-loaded

### Environment Variables
The deployment automatically sets:
- `NODE_ENV=production`
- `PORT=8080`
- `WEBSITE_NODE_DEFAULT_VERSION=18-lts`

## Monitoring and Troubleshooting

### View Application Logs
```bash
az webapp log tail --resource-group ODL-Infosys-Hack-1775376-09 --name health-nexus-ai-app
```

### Enable Application Insights
```bash
az webapp config appsettings set \
  --resource-group ODL-Infosys-Hack-1775376-09 \
  --name health-nexus-ai-app \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=your-key
```

### Common Issues

1. **Build Failures**
   - Ensure Node.js 18+ is used
   - Check package.json scripts
   - Verify all dependencies are installed

2. **Runtime Errors**
   - Check startup command configuration
   - Verify static file serving
   - Review application logs

3. **Performance Issues**
   - Consider upgrading App Service Plan
   - Enable Application Insights monitoring
   - Review resource usage metrics

## Features Available After Deployment

### Health Portal Dashboard
- **Real-time Agent Monitoring**: Live status of all Foundry agents
- **Patient Analysis Workflows**: Comprehensive health assessments
- **Interactive Demonstrations**: Full agent capability showcase
- **Performance Analytics**: Response times, success rates, costs

### Azure Foundry Integration
- **Multi-Agent Orchestration**: Coordinate multiple specialized agents
- **Workflow Management**: Complex medical analysis pipelines
- **Cost Tracking**: Monitor usage and optimize resources
- **Auto-scaling**: Dynamic capacity adjustment

### Mock Data Scenarios
- **Radiology Cases**: X-ray, CT, MRI analysis examples
- **Pathology Samples**: Tissue analysis demonstrations
- **Genomic Profiles**: Genetic risk assessments
- **Lab Results**: Comprehensive test interpretations

## Production Considerations

### Security
- Enable HTTPS (automatically configured)
- Configure authentication if required
- Set up Azure Key Vault for secrets
- Implement proper RBAC

### Scalability
- Monitor resource usage
- Consider App Service scaling rules
- Implement caching strategies
- Optimize database connections

### Cost Management
- Monitor Azure costs
- Set up billing alerts
- Consider reserved instances
- Optimize resource usage

## Next Steps

1. **Access your deployed application** at: `https://health-nexus-ai-app.azurewebsites.net`
2. **Explore the Foundry Agent Dashboard** to see all agents in action
3. **Run patient analysis workflows** to demonstrate capabilities
4. **Monitor performance** through Azure Portal
5. **Scale resources** as needed for your use case

## Support

For issues or questions:
- Check Azure Portal diagnostics
- Review application logs
- Consult Azure App Service documentation
- Monitor Application Insights metrics

Your Health Nexus AI application with Azure Foundry agents is now ready for production use!