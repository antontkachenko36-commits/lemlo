import React, { createContext, useContext, useState, useEffect } from 'react';
import { persistentStorage } from '../lib/storage';

interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  type: 'contact' | 'support' | 'partnership' | 'creator' | 'general';
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
}

interface BackupData {
  timestamp: number;
  data: {
    guides: Guide[];
    pricingPlans: PricingPlan[];
    messages: Message[];
    version: string;
    created: string;
  };
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  guides: Guide[];
  pricingPlans: PricingPlan[];
  messages: Message[];
  addGuide: (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGuide: (id: string, guide: Partial<Guide>) => Promise<void>;
  deleteGuide: (id: string) => Promise<void>;
  getGuideById: (id: string) => Guide | undefined;
  addPricingPlan: (plan: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePricingPlan: (id: string, plan: Partial<PricingPlan>) => Promise<void>;
  deletePricingPlan: (id: string) => Promise<void>;
  getPricingPlanById: (id: string) => PricingPlan | undefined;
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateMessageStatus: (id: string, status: Message['status']) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  getMessageStats: () => { total: number; new: number; needReply: number; replied: number };
  createBackup: () => Promise<void>;
  restoreBackup: (timestamp: number) => Promise<boolean>;
  getBackups: () => Promise<BackupData[]>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  username: 'kreosan',
  passwords: ['KR-1838hD2@', 'KR-86771857G!', 'KR-hT84791@#D!D']
};

const INITIAL_GUIDES: Guide[] = [
  {
    id: '1',
    title: 'How to Set Up a Minecraft Server',
    category: 'Getting Started',
    readTime: '5 min read',
    difficulty: 'Beginner',
    content: `# How to Set Up a Minecraft Server

Welcome to our comprehensive guide on setting up your first Minecraft server with Deplos!

## Prerequisites

Before we begin, make sure you have:
- A Deplos account (sign up at https://client.deplos.com)
- Basic understanding of Minecraft gameplay
- Access to your email for verification

## Step 1: Creating Your Server

1. **Log into your Deplos panel**
   - Navigate to https://panel.deplos.com
   - Enter your login credentials
   - Click on "Create New Server"

2. **Choose Your Plan**
   - For beginners, we recommend starting with our Free plan
   - You can always upgrade later as your community grows

3. **Select Server Type**
   - Choose "Minecraft Java Edition"
   - Select your preferred Minecraft version (we recommend the latest stable release)

## Step 2: Basic Configuration

### Server Properties
Configure these essential settings:

- **Server Name**: Choose a memorable name for your server
- **MOTD (Message of the Day)**: This appears in the server list
- **Max Players**: Start with 10-20 players for testing
- **Difficulty**: Choose between Peaceful, Easy, Normal, or Hard
- **Game Mode**: Survival, Creative, Adventure, or Spectator

### World Settings
- **World Type**: Default, Flat, Large Biomes, or Custom
- **Generate Structures**: Enable for villages, dungeons, etc.
- **Spawn Protection**: Recommended to keep at default (16 blocks)

## Step 3: Starting Your Server

1. Click the "Start Server" button in your control panel
2. Wait for the server to initialize (usually takes 30-60 seconds)
3. Your server IP will be displayed once it's online

## Step 4: Connecting to Your Server

1. Open Minecraft Java Edition
2. Click "Multiplayer"
3. Click "Add Server"
4. Enter your server name and IP address
5. Click "Done" and then "Join Server"

## Step 5: Basic Administration

### Essential Commands
- \`/op <username>\` - Give operator permissions
- \`/gamemode <mode> <player>\` - Change game mode
- \`/tp <player1> <player2>\` - Teleport players
- \`/ban <player>\` - Ban a player
- \`/pardon <player>\` - Unban a player

### Server Management
- Use the control panel to restart, stop, or configure your server
- Monitor server performance through the dashboard
- Set up automatic backups to protect your world

## Troubleshooting Common Issues

### Server Won't Start
- Check if you have sufficient resources allocated
- Verify your server configuration files
- Contact support if the issue persists

### Players Can't Connect
- Ensure your server is online and running
- Check if the IP address is correct
- Verify that players are using the correct Minecraft version

### Performance Issues
- Monitor your server's CPU and RAM usage
- Consider upgrading your plan if resources are maxed out
- Remove unnecessary plugins or mods

## Next Steps

Now that your server is running, consider:
- Installing plugins to enhance gameplay
- Setting up a whitelist for security
- Creating rules and guidelines for your community
- Promoting your server to attract players

## Need Help?

If you encounter any issues:
- Check our FAQ section
- Join our Discord community for peer support
- Contact our 24/7 support team
- Browse our other guides for advanced topics

Happy gaming with Deplos!`,
    published: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    tags: ['minecraft', 'setup', 'beginner'],
    author: 'Deplos Team',
  },
  {
    id: '2',
    title: 'Optimizing Server Performance',
    category: 'Advanced',
    readTime: '10 min read',
    difficulty: 'Intermediate',
    content: `# Optimizing Server Performance

Learn how to maximize your server's performance and provide the best experience for your players.

## Understanding Server Performance

Server performance is crucial for providing a smooth gaming experience. Poor performance can lead to:
- High latency and lag
- Player disconnections
- Reduced player satisfaction
- Server crashes

## Key Performance Metrics

### CPU Usage
- Monitor CPU usage in your control panel
- High CPU usage (>80%) indicates performance issues
- Consider upgrading if consistently high

### RAM Usage
- Minecraft servers are memory-intensive
- Monitor RAM usage regularly
- Allocate appropriate memory based on player count

### Network Performance
- Monitor network I/O
- High network usage may indicate DDoS attacks
- Use our built-in DDoS protection

## Optimization Techniques

### 1. Server Configuration

#### server.properties Optimization
\`\`\`properties
# Reduce view distance for better performance
view-distance=8

# Optimize entity limits
spawn-limits.monsters=50
spawn-limits.animals=10
spawn-limits.water-animals=5

# Reduce simulation distance
simulation-distance=6
\`\`\`

#### JVM Arguments
Use optimized JVM flags for better garbage collection:
\`\`\`
-Xms2G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200
\`\`\`

### 2. Plugin Optimization

#### Choose Lightweight Plugins
- Research plugin performance impact
- Use alternatives for resource-heavy plugins
- Regularly update plugins

#### Plugin Configuration
- Disable unnecessary features
- Optimize plugin update intervals
- Use async operations when possible

### 3. World Optimization

#### Pregenerate Chunks
- Use plugins like WorldBorder to pregenerate world chunks
- Reduces CPU load during exploration
- Improves player experience

#### Regular Maintenance
- Remove unused chunks
- Clear entity buildup
- Optimize redstone contraptions

## Monitoring Tools

### Built-in Monitoring
- Use Deplos control panel metrics
- Monitor real-time performance
- Set up alerts for issues

### Third-party Tools
- Spark profiler for detailed analysis
- TimingsV2 for plugin performance
- Server monitoring plugins

## Performance Troubleshooting

### High CPU Usage
1. Check for infinite loops in redstone
2. Identify problematic plugins
3. Reduce mob spawning
4. Optimize world generation

### Memory Leaks
1. Monitor heap usage over time
2. Restart server regularly
3. Update plugins and server software
4. Check for memory-intensive operations

### Network Issues
1. Monitor bandwidth usage
2. Check for DDoS attacks
3. Optimize packet handling
4. Use compression when possible

## Advanced Optimization

### Database Optimization
- Use efficient data storage
- Optimize database queries
- Consider caching solutions
- Regular database maintenance

### Load Balancing
- Distribute players across multiple servers
- Use proxy servers for large networks
- Implement queue systems

### Caching Strategies
- Cache frequently accessed data
- Use Redis for session storage
- Implement smart caching policies

## Best Practices

1. **Regular Monitoring**: Check performance metrics daily
2. **Gradual Changes**: Make one optimization at a time
3. **Testing**: Test changes in a development environment
4. **Documentation**: Keep track of configuration changes
5. **Backups**: Always backup before making changes

## When to Upgrade

Consider upgrading your plan when:
- CPU usage consistently above 80%
- RAM usage above 90%
- Frequent server lag or crashes
- Player complaints about performance

## Conclusion

Server optimization is an ongoing process. Regular monitoring and maintenance will ensure your server provides the best possible experience for your players.

For more advanced optimization techniques, contact our support team or check our other performance guides.`,
    published: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    tags: ['performance', 'optimization', 'advanced'],
    author: 'Deplos Team',
  },
  {
    id: '3',
    title: 'Installing and Managing Plugins',
    category: 'Configuration',
    readTime: '7 min read',
    difficulty: 'Beginner',
    content: `# Installing and Managing Plugins

Plugins extend your Minecraft server's functionality and create unique experiences for your players.

## What are Plugins?

Plugins are add-ons that modify or extend your server's functionality. They can:
- Add new commands and features
- Modify game mechanics
- Provide administrative tools
- Create custom game modes
- Add economy systems

## Prerequisites

Before installing plugins, ensure:
- Your server is running Bukkit, Spigot, or Paper
- You have FTP access to your server
- You understand basic server administration

## Finding Plugins

### Recommended Sources
1. **SpigotMC** - https://www.spigotmc.org/resources/
2. **Bukkit** - https://dev.bukkit.org/projects
3. **GitHub** - Open source plugins
4. **CurseForge** - Community plugins

### Plugin Categories
- **Essential**: WorldEdit, WorldGuard, LuckPerms
- **Economy**: Vault, EssentialsX, ChestShop
- **Protection**: GriefPrevention, Residence, Towny
- **Fun**: Citizens, MythicMobs, Quests

## Installing Plugins

### Method 1: File Manager (Recommended)
1. Log into your Deplos control panel
2. Navigate to "File Manager"
3. Open the "plugins" folder
4. Click "Upload" and select your plugin JAR file
5. Restart your server

### Method 2: FTP Upload
1. Connect to your server via FTP
2. Navigate to the plugins directory
3. Upload the plugin JAR file
4. Restart your server

## Plugin Configuration

### Initial Setup
After installing a plugin:
1. Restart your server to generate config files
2. Check the console for any errors
3. Review the plugin's configuration files
4. Customize settings as needed

### Common Configuration Files
- \`config.yml\` - Main configuration
- \`messages.yml\` - Custom messages
- \`permissions.yml\` - Permission settings
- \`data.yml\` - Plugin data storage

## Essential Plugins Guide

### 1. EssentialsX
**Purpose**: Core server commands and utilities

**Installation**:
1. Download from SpigotMC
2. Upload to plugins folder
3. Restart server

**Key Features**:
- Player homes and warps
- Economy system
- Chat formatting
- Teleportation commands

### 2. WorldEdit & WorldGuard
**Purpose**: World editing and protection

**Installation**:
1. Install WorldEdit first
2. Then install WorldGuard
3. Restart server

**Key Features**:
- Region protection
- Build permissions
- PvP control
- Flag management

### 3. LuckPerms
**Purpose**: Advanced permission management

**Installation**:
1. Download from SpigotMC
2. Upload and restart
3. Configure database (optional)

**Key Features**:
- Group-based permissions
- Web editor interface
- Inheritance system
- Context-based permissions

## Plugin Management

### Updating Plugins
1. Download the latest version
2. Stop your server
3. Replace the old JAR file
4. Start your server
5. Check for configuration updates

### Removing Plugins
1. Stop your server
2. Delete the plugin JAR file
3. Remove plugin configuration folders (optional)
4. Start your server

### Troubleshooting Plugins

#### Plugin Won't Load
- Check server version compatibility
- Verify dependencies are installed
- Review console error messages
- Check file permissions

#### Plugin Conflicts
- Disable plugins one by one
- Check for duplicate functionality
- Review plugin documentation
- Contact plugin developers

## Plugin Permissions

### Understanding Permissions
Permissions control what players can do:
- \`plugin.command.use\` - Use plugin commands
- \`plugin.admin\` - Administrative access
- \`plugin.bypass\` - Bypass restrictions

### Setting Permissions
1. Use a permission plugin (LuckPerms recommended)
2. Create permission groups
3. Assign permissions to groups
4. Add players to groups

### Example Permission Setup
\`\`\`yaml
groups:
  default:
    permissions:
      - essentials.home
      - essentials.sethome
  vip:
    permissions:
      - essentials.fly
      - worldedit.selection
  admin:
    permissions:
      - "*"
\`\`\`

## Performance Considerations

### Plugin Impact
- Monitor server performance after installing plugins
- Some plugins are more resource-intensive
- Consider alternatives for heavy plugins
- Regular performance audits

### Optimization Tips
1. Disable unused plugin features
2. Adjust update intervals
3. Use async operations
4. Regular plugin updates

## Security Best Practices

### Plugin Security
1. Only download from trusted sources
2. Keep plugins updated
3. Review plugin permissions
4. Monitor plugin access logs

### Configuration Security
- Secure sensitive configuration files
- Use strong passwords for plugin databases
- Limit administrative permissions
- Regular security audits

## Recommended Plugin Combinations

### Survival Server
- EssentialsX
- WorldGuard
- GriefPrevention
- ChestShop
- Citizens

### Creative Server
- WorldEdit
- VoxelSniper
- PlotSquared
- Multiverse
- CommandHelper

### PvP Server
- Factions
- McMMO
- Bounty Hunters
- KitPvP
- Leaderboards

## Getting Help

### Plugin Support
1. Read plugin documentation
2. Check plugin forums
3. Contact plugin developers
4. Join plugin Discord servers

### Deplos Support
- 24/7 technical support
- Plugin installation assistance
- Performance optimization help
- Configuration guidance

## Conclusion

Plugins are essential for creating unique server experiences. Start with essential plugins and gradually add more based on your server's needs.

Remember to always backup your server before making changes and test plugins in a development environment first.

Happy plugin management!`,
    published: true,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    tags: ['plugins', 'minecraft', 'configuration'],
    author: 'Deplos Team',
  },
  {
    id: '4',
    title: 'Setting Up Automatic Backups',
    category: 'Management',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    content: `# Setting Up Automatic Backups

Protect your server data with automated backup solutions. Learn how to configure, schedule, and manage backups effectively.

## Why Backups Are Essential

Backups protect against:
- Server crashes and corruption
- Accidental deletions
- Plugin conflicts
- Hardware failures
- Griefing and malicious activities

## Backup Types

### Full Backups
- Complete server data copy
- Includes worlds, plugins, and configurations
- Larger file sizes but complete protection

### Incremental Backups
- Only changed files since last backup
- Smaller file sizes
- Faster backup process
- Requires full backup as base

### World-Only Backups
- Only world data
- Smaller and faster
- Good for frequent backups
- Doesn't include plugin data

## Deplos Backup Features

### Automatic Backups
- Built-in backup system
- Scheduled backups
- Cloud storage integration
- Easy restoration process

### Manual Backups
- On-demand backup creation
- Pre-maintenance backups
- Testing environment snapshots

## Setting Up Automatic Backups

### Step 1: Access Backup Settings
1. Log into your Deplos control panel
2. Navigate to "Backups" section
3. Click "Backup Settings"

### Step 2: Configure Backup Schedule
\`\`\`
Daily Backups: 2:00 AM server time
Weekly Backups: Sunday 1:00 AM
Monthly Backups: 1st of month 12:00 AM
\`\`\`

### Step 3: Set Retention Policy
- Daily: Keep 7 days
- Weekly: Keep 4 weeks
- Monthly: Keep 12 months

### Step 4: Choose Backup Type
- **Recommended**: Full backup weekly, incremental daily
- **High Activity**: Full backup daily
- **Low Activity**: Full backup weekly

## Plugin-Based Backup Solutions

### WorldGuard Backup
**Installation**:
1. Install WorldGuard plugin
2. Configure backup settings in config.yml
3. Set up scheduled tasks

**Configuration**:
\`\`\`yaml
backup:
  enabled: true
  interval: 1440  # 24 hours in minutes
  keep-backups: 7
  compression: true
\`\`\`

### BackupPC Plugin
**Features**:
- Automated scheduling
- Compression options
- Multiple storage locations
- Restoration tools

**Setup**:
1. Download and install plugin
2. Configure backup directories
3. Set up cron-like scheduling
4. Test backup and restore

## Manual Backup Process

### Using Control Panel
1. Navigate to "Backups" section
2. Click "Create Backup"
3. Choose backup type (Full/World only)
4. Add description/notes
5. Click "Start Backup"

### Using FTP
1. Connect via FTP client
2. Download entire server directory
3. Compress files for storage
4. Store in secure location

### Command Line Method
\`\`\`bash
# Create compressed backup
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/server/

# Create world-only backup
tar -czf world_backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/server/world/
\`\`\`

## Backup Storage Options

### Local Storage
- Fast access and restoration
- Limited by server disk space
- Risk of hardware failure

### Cloud Storage
- Offsite protection
- Unlimited storage (with cost)
- Slower access times
- Multiple provider options

### Hybrid Approach
- Recent backups locally
- Older backups in cloud
- Best of both worlds
- Automated migration

## Restoration Process

### From Control Panel
1. Navigate to "Backups" section
2. Select backup to restore
3. Choose restoration type:
   - Full server restore
   - World only restore
   - Selective file restore
4. Confirm restoration
5. Wait for completion

### Manual Restoration
1. Stop your server
2. Download backup files
3. Extract to server directory
4. Overwrite existing files
5. Start server and verify

## Backup Best Practices

### Scheduling
- Backup during low-activity periods
- Avoid peak playing hours
- Consider time zone differences
- Test backup schedules

### Testing
- Regularly test backup restoration
- Verify backup integrity
- Practice restoration procedures
- Document restoration steps

### Monitoring
- Check backup completion status
- Monitor backup file sizes
- Verify backup schedules
- Set up failure alerts

## Advanced Backup Strategies

### Multi-Location Backups
Store backups in multiple locations:
- Primary: Local server storage
- Secondary: Cloud storage
- Tertiary: External drive/server

### Versioned Backups
Keep multiple versions:
- Hourly: Last 24 hours
- Daily: Last 7 days
- Weekly: Last 4 weeks
- Monthly: Last 12 months

### Encrypted Backups
Protect sensitive data:
- Use encryption for cloud storage
- Secure backup transfer protocols
- Password-protected archives
- Access control policies

## Troubleshooting Backup Issues

### Backup Failures
Common causes and solutions:
- **Insufficient disk space**: Clean up old backups
- **Permission errors**: Check file permissions
- **Plugin conflicts**: Disable conflicting plugins
- **Network issues**: Check connectivity

### Restoration Problems
- **Corrupted backups**: Use previous backup
- **Version mismatches**: Check compatibility
- **Missing dependencies**: Install required plugins
- **Permission issues**: Reset file permissions

## Monitoring and Alerts

### Backup Monitoring
Set up monitoring for:
- Backup completion status
- Backup file sizes
- Storage space usage
- Backup schedule adherence

### Alert Configuration
Configure alerts for:
- Failed backups
- Storage space warnings
- Unusual backup sizes
- Schedule deviations

## Cost Optimization

### Storage Costs
- Use compression to reduce sizes
- Implement retention policies
- Choose cost-effective storage tiers
- Monitor storage usage

### Bandwidth Costs
- Schedule backups during off-peak hours
- Use incremental backups
- Compress data before transfer
- Consider local storage for frequent access

## Compliance and Legal

### Data Protection
- Understand data protection laws
- Implement appropriate security measures
- Document backup procedures
- Regular compliance audits

### Retention Policies
- Define data retention periods
- Implement automated deletion
- Document legal requirements
- Regular policy reviews

## Conclusion

Automated backups are crucial for server reliability and data protection. Implement a comprehensive backup strategy that includes:

1. Regular automated backups
2. Multiple storage locations
3. Tested restoration procedures
4. Monitoring and alerting
5. Documentation and training

Remember: A backup is only as good as your ability to restore from it. Test your backups regularly!

For assistance with backup configuration, contact our support team 24/7.`,
    published: true,
    createdAt: '2024-01-08T13:20:00Z',
    updatedAt: '2024-01-22T15:45:00Z',
    tags: ['backups', 'management', 'data-protection'],
    author: 'Deplos Team',
  },
];

const INITIAL_PRICING_PLANS: PricingPlan[] = [
  {
    id: '1',
    name: 'Free',
    price: '0',
    period: 'Forever',
    description: 'Perfect for testing and small communities',
    features: [
      '90% CPU Performance',
      '1800MB RAM',
      '5GB SSD Storage',
      'Low Priority Support',
      'Basic DDoS Protection',
      'Community Discord Access',
      'Standard Network Speed',
    ],
    popular: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mini',
    price: '5',
    period: 'per month',
    description: 'Great for growing communities',
    features: [
      '110% CPU Performance',
      '2400MB RAM',
      '10GB SSD Storage',
      'Medium Priority Support',
      'Advanced DDoS Protection',
      'Private Location Access',
      'Enhanced Network Speed',
      'Automated Backups',
    ],
    popular: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Alpha',
    price: '15',
    period: 'per month',
    description: 'Ultimate performance for large servers',
    features: [
      '130% CPU Performance',
      '3000MB RAM',
      '15GB NVMe SSD Storage',
      'High Priority Support',
      'Premium DDoS Protection',
      'Private Location Access',
      'VIP Chat Access',
      'Fast NVMe SSD',
      'Priority Network Routing',
      'Custom Server Configurations',
    ],
    popular: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Функция для обновления данных
  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing data...');
      
      const loadedGuides = await persistentStorage.loadData('guides');
      const loadedPlans = await persistentStorage.loadData('pricingPlans');
      const loadedMessages = await persistentStorage.loadData('messages');
      
      console.log('📊 Loaded data:', {
        guides: loadedGuides.length,
        plans: loadedPlans.length,
        messages: loadedMessages.length
      });
      
      setGuides(loadedGuides);
      setPricingPlans(loadedPlans);
      setMessages(loadedMessages);
      
      clearError();
    } catch (error) {
      console.error('❌ Failed to refresh data:', error);
      setError('Ошибка при обновлении данных');
    }
  };

  // Инициализация и загрузка данных
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🚀 Initializing storage...');
        
        // Инициализируем хранилище
        await persistentStorage.init();
        
        // Синхронизируем с localStorage
        await persistentStorage.syncWithLocalStorage();
        
        // Загружаем данные
        const loadedGuides = await persistentStorage.loadData('guides');
        const loadedPlans = await persistentStorage.loadData('pricingPlans');
        const loadedMessages = await persistentStorage.loadData('messages');
        
        console.log('📊 Initial data loaded:', {
          guides: loadedGuides.length,
          plans: loadedPlans.length,
          messages: loadedMessages.length
        });
        
        // Если данных нет, используем начальные данные
        if (loadedGuides.length === 0) {
          console.log('📝 Setting up initial guides...');
          await persistentStorage.saveData('guides', INITIAL_GUIDES);
          setGuides(INITIAL_GUIDES);
        } else {
          setGuides(loadedGuides);
        }
        
        if (loadedPlans.length === 0) {
          console.log('💰 Setting up initial pricing plans...');
          await persistentStorage.saveData('pricingPlans', INITIAL_PRICING_PLANS);
          setPricingPlans(INITIAL_PRICING_PLANS);
        } else {
          setPricingPlans(loadedPlans);
        }
        
        // Сообщения могут быть пустыми изначально
        setMessages(loadedMessages);
        
        // Проверяем целостность данных
        const validation = await persistentStorage.validateData();
        if (!validation.isValid) {
          console.warn('⚠️ Data validation issues:', validation.errors);
        }
        
        // Создаем первоначальную резервную копию
        await persistentStorage.createBackup();
        
        // Очищаем старые резервные копии
        await persistentStorage.cleanupOldBackups();
        
        // Проверяем статус аутентификации
        const authStatus = localStorage.getItem('admin_authenticated');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        }
        
        console.log('✅ Initialization complete');
        
      } catch (error) {
        console.error('❌ Failed to initialize data:', error);
        setError('Ошибка инициализации данных. Используются резервные данные.');
        
        // Fallback к localStorage
        try {
          const localGuides = JSON.parse(localStorage.getItem('deplos_guides') || '[]');
          const localPlans = JSON.parse(localStorage.getItem('deplos_pricing_plans') || '[]');
          const localMessages = JSON.parse(localStorage.getItem('deplos_messages') || '[]');
          
          setGuides(localGuides.length > 0 ? localGuides : INITIAL_GUIDES);
          setPricingPlans(localPlans.length > 0 ? localPlans : INITIAL_PRICING_PLANS);
          setMessages(localMessages);
        } catch (fallbackError) {
          console.error('❌ Fallback failed:', fallbackError);
          setGuides(INITIAL_GUIDES);
          setPricingPlans(INITIAL_PRICING_PLANS);
          setMessages([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Автоматическое создание резервных копий каждые 30 минут
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await persistentStorage.createBackup();
        await persistentStorage.cleanupOldBackups();
      } catch (error) {
        console.error('Auto backup failed:', error);
      }
    }, 30 * 60 * 1000); // 30 минут

    return () => clearInterval(interval);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && ADMIN_CREDENTIALS.passwords.includes(password)) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const addGuide = async (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const newGuide: Guide = { 
        ...guide, 
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedGuides = [...guides, newGuide];
      setGuides(updatedGuides);
      
      await persistentStorage.saveData('guides', updatedGuides);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to save guide:', error);
      setError('Не удалось сохранить гайд');
      throw error;
    }
  };

  const updateGuide = async (id: string, updatedGuide: Partial<Guide>) => {
    try {
      const updatedGuides = guides.map(guide => 
        guide.id === id ? { ...guide, ...updatedGuide, updatedAt: new Date().toISOString() } : guide
      );
      
      setGuides(updatedGuides);
      
      await persistentStorage.saveData('guides', updatedGuides);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to update guide:', error);
      setError('Не удалось обновить гайд');
      throw error;
    }
  };

  const deleteGuide = async (id: string) => {
    try {
      const updatedGuides = guides.filter(guide => guide.id !== id);
      setGuides(updatedGuides);
      
      await persistentStorage.saveData('guides', updatedGuides);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to delete guide:', error);
      setError('Не удалось удалить гайд');
      throw error;
    }
  };

  const getGuideById = (id: string): Guide | undefined => {
    return guides.find(guide => guide.id === id);
  };

  const addPricingPlan = async (plan: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const newPlan: PricingPlan = { 
        ...plan, 
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedPlans = [...pricingPlans, newPlan];
      setPricingPlans(updatedPlans);
      
      await persistentStorage.saveData('pricingPlans', updatedPlans);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to save pricing plan:', error);
      setError('Не удалось сохранить тарифный план');
      throw error;
    }
  };

  const updatePricingPlan = async (id: string, updatedPlan: Partial<PricingPlan>) => {
    try {
      const updatedPlans = pricingPlans.map(plan => 
        plan.id === id ? { ...plan, ...updatedPlan, updatedAt: new Date().toISOString() } : plan
      );
      
      setPricingPlans(updatedPlans);
      
      await persistentStorage.saveData('pricingPlans', updatedPlans);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to update pricing plan:', error);
      setError('Не удалось обновить тарифный план');
      throw error;
    }
  };

  const deletePricingPlan = async (id: string) => {
    try {
      const updatedPlans = pricingPlans.filter(plan => plan.id !== id);
      setPricingPlans(updatedPlans);
      
      await persistentStorage.saveData('pricingPlans', updatedPlans);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to delete pricing plan:', error);
      setError('Не удалось удалить тарифный план');
      throw error;
    }
  };

  const getPricingPlanById = (id: string): PricingPlan | undefined => {
    return pricingPlans.find(plan => plan.id === id);
  };

  // Функции для работы с сообщениями
  const addMessage = async (messageData: Omit<Message, 'id' | 'createdAt' | 'status'>) => {
    try {
      const now = new Date().toISOString();
      const newMessage: Message = {
        ...messageData,
        id: Date.now().toString(),
        createdAt: now,
        status: 'new',
      };
      
      console.log('💬 Adding new message:', newMessage);
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Сохраняем в хранилище
      await persistentStorage.saveData('messages', updatedMessages);
      await persistentStorage.createBackup();
      
      console.log('✅ Message saved successfully');
      clearError();
    } catch (error) {
      console.error('❌ Failed to save message:', error);
      setError('Не удалось сохранить сообщение');
      throw error;
    }
  };

  const updateMessageStatus = async (id: string, status: Message['status']) => {
    try {
      const now = new Date().toISOString();
      const updatedMessages = messages.map(message => {
        if (message.id === id) {
          const updates: Partial<Message> = { status };
          if (status === 'read' && !message.readAt) {
            updates.readAt = now;
          } else if (status === 'replied') {
            updates.repliedAt = now;
          }
          return { ...message, ...updates };
        }
        return message;
      });
      
      setMessages(updatedMessages);
      
      await persistentStorage.saveData('messages', updatedMessages);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to update message status:', error);
      setError('Не удалось обновить статус сообщения');
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const updatedMessages = messages.filter(message => message.id !== id);
      setMessages(updatedMessages);
      
      await persistentStorage.saveData('messages', updatedMessages);
      await persistentStorage.createBackup();
      
      clearError();
    } catch (error) {
      console.error('Failed to delete message:', error);
      setError('Не удалось удалить сообщение');
      throw error;
    }
  };

  const getMessageStats = () => {
    const total = messages.length;
    const newMessages = messages.filter(m => m.status === 'new').length;
    const needReply = messages.filter(m => m.status === 'read').length;
    const replied = messages.filter(m => m.status === 'replied').length;
    
    return { total, new: newMessages, needReply, replied };
  };

  const createBackup = async () => {
    try {
      await persistentStorage.createBackup();
      clearError();
    } catch (error) {
      console.error('Failed to create backup:', error);
      setError('Не удалось создать резервную копию');
      throw error;
    }
  };

  const restoreBackup = async (timestamp: number): Promise<boolean> => {
    try {
      const success = await persistentStorage.restoreFromBackup(timestamp);
      if (success) {
        // Перезагружаем данные после восстановления
        await refreshData();
        clearError();
      } else {
        setError('Не удалось восстановить данные из резервной копии');
      }
      return success;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      setError('Ошибка при восстановлении данных');
      return false;
    }
  };

  const getBackups = async (): Promise<BackupData[]> => {
    try {
      const backups = await persistentStorage.getBackups();
      clearError();
      return backups;
    } catch (error) {
      console.error('Failed to get backups:', error);
      setError('Не удалось загрузить список резервных копий');
      return [];
    }
  };

  const exportData = async (): Promise<string> => {
    try {
      const data = await persistentStorage.exportData();
      clearError();
      return data;
    } catch (error) {
      console.error('Failed to export data:', error);
      setError('Не удалось экспортировать данные');
      throw error;
    }
  };

  const importData = async (jsonData: string): Promise<boolean> => {
    try {
      const success = await persistentStorage.importData(jsonData);
      if (success) {
        // Перезагружаем данные после импорта
        await refreshData();
        clearError();
      } else {
        setError('Не удалось импортировать данные. Проверьте формат файла.');
      }
      return success;
    } catch (error) {
      console.error('Failed to import data:', error);
      setError('Ошибка при импорте данных');
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      guides,
      pricingPlans,
      messages,
      addGuide,
      updateGuide,
      deleteGuide,
      getGuideById,
      addPricingPlan,
      updatePricingPlan,
      deletePricingPlan,
      getPricingPlanById,
      addMessage,
      updateMessageStatus,
      deleteMessage,
      getMessageStats,
      createBackup,
      restoreBackup,
      getBackups,
      exportData,
      importData,
      isLoading,
      error,
      clearError,
      refreshData,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};