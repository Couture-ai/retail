 #  AI RETAIL Platform

A comprehensive retail analytics and forecasting platform built for managing multi-brand retail operations. The platform provides intelligent forecasting, inventory management, and AI-powered analytics for retail chains.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Data Model](#data-model)
- [AI Agent Integration](#ai-agent-integration)
- [Development](#development)
- [Configuration](#configuration)
- [Deployment](#deployment)

## 🎯 Overview

This platform is designed for retail operations management across multiple brands (Reliance Digital, Reliance Jewels, Fashion & Lifestyle). It provides:

- **Demand Forecasting**: ML-powered forecasting with baseline comparison
- **Inventory Management**: Purchase order generation and stock tracking
- **Store Management**: Hierarchical store organization (Region → State → City → Store)
- **Product Management**: Multi-level product categorization
- **AI-Powered Analytics**: Natural language queries using Claude AI
- **Real-time Dashboards**: Performance metrics and KPIs
- **Role-based Access Control**: Enterprise-grade authentication and authorization

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Analytics   │  │  Forecasting │  │   AI Agent   │  │
│  │  Dashboard   │  │   Module     │  │    Chat      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────┐
│                Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Core      │  │     Auth     │  │   Utilities  │  │
│  │   Routes     │  │   Module     │  │    Module    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │  ClickHouse  │  │    Redis     │  │
│  │   (Primary)  │  │  (Analytics) │  │   (Cache)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Technology Flow

1. **Frontend**: React SPA with TypeScript, Vite build system
2. **API Gateway**: FastAPI with async request handling
3. **Authentication**: OAuth2/OIDC integration with JWT tokens
4. **AI Processing**: Anthropic Claude API integration
5. **Data Storage**: PostgreSQL for transactional data, ClickHouse for analytics (optional)
6. **Caching**: Redis cluster for performance optimization (optional)

## ✨ Features

### 1. Dashboard & Analytics
- **Overview Statistics**: Total stores, products, forecasts, and sales
- **Regional Performance**: Store metrics grouped by region
- **Product Performance**: Forecast accuracy and sales by category
- **Weekly Trends**: Forecast vs actual comparison
- **Low Stock Alerts**: Automated inventory alerts
- **Custom Analytics**: AI-powered data exploration

### 2. Forecasting Module
- **Multi-level Forecasting**: Store and product level predictions
- **Baseline Comparison**: Model performance vs consensus forecasting
- **Accuracy Metrics**: MAE, MAPE, RMSE calculations
- **Adjustments**: Manual forecast adjustments and tracking
- **Historical Analysis**: Time-series forecast visualization

### 3. Store Management
- **Hierarchical Navigation**: Region → State → City → Store
- **Store Details**: Performance metrics per store
- **Bulk Operations**: Multi-store data management
- **Store Attributes**: Location, type, format tracking

### 4. Product Management
- **Category Hierarchy**: Vertical → Super Category → Segment → Article
- **Product Attributes**: Brand, division, segment tracking
- **Performance Tracking**: Sales and forecast accuracy per product
- **Inventory Levels**: Stock tracking across stores

### 5. Inventory Management
- **Purchase Orders**: Automated PO generation based on forecasts
- **Order History**: Track order status and delivery
- **Replenishment Planning**: State and category-level recommendations
- **Stock Optimization**: Balance inventory across locations

### 6. AI Agent
- **Natural Language Queries**: Ask questions in plain English
- **Automated SQL Generation**: Convert questions to SQL queries
- **Visual Analytics**: Generate charts and tables dynamically
- **Context-aware**: Understands store and product hierarchies
- **Multi-turn Conversations**: Maintain context across queries

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI 0.x (Python 3.12+)
- **Database**: PostgreSQL (primary), ClickHouse (analytics)
- **ORM**: SQLAlchemy 2.x with async support
- **Authentication**: OAuth2, JWT, Passlib
- **Data Processing**: Pandas, NumPy, PyArrow
- **API Documentation**: OpenAPI/Swagger

### Frontend
- **Framework**: React 18.3+
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.6+
- **Routing**: Wouter
- **State Management**: React Context + TanStack Query
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 3.4+
- **Charts**: Nivo, Recharts
- **Code Editor**: Monaco Editor
- **Forms**: React Hook Form + Zod validation

### AI & Analytics
- **AI Provider**: Anthropic Claude (Claude 3.5 Sonnet)
- **Query Processing**: Custom SQL generation and validation
- **Visualization**: Dynamic chart generation

### DevOps
- **Containerization**: Docker, Docker Compose
- **Web Server**: Uvicorn (ASGI)
- **Process Manager**: Configurable workers

## 📁 Project Structure

```
retail/
├── backend/
│   ├── app/
│   │   ├── auth/                 # Authentication & authorization
│   │   │   ├── routes/           # Auth endpoints
│   │   │   │   ├── routes.py     # OAuth2 login/logout
│   │   │   │   ├── user.py       # User management
│   │   │   │   └── init_script.py # Initial setup
│   │   │   ├── permissions.py    # RBAC logic
│   │   │   └── schema.py         # Auth models
│   │   ├── core/
│   │   │   └── routes.py         # Core API endpoints (1000+ lines)
│   │   ├── db/
│   │   │   ├── postgres_db.py    # PostgreSQL connection
│   │   │   ├── clickhouse.py     # ClickHouse connection
│   │   │   └── redis.py          # Redis connection
│   │   ├── utils/
│   │   │   ├── commons.py        # Shared utilities
│   │   │   ├── upload.py         # File upload handlers
│   │   │   └── catalog_data/     # Product catalog files
│   │   ├── main.py               # FastAPI application
│   │   ├── schema.py             # Database models
│   │   ├── settings.py           # Configuration
│   │   └── requirements.txt      # Python dependencies
│   ├── data/                     # Forecast data files (partitioned)
│   │   └── week_start_date=YYYY-MM-DD/
│   │       └── family=CATEGORY/
│   │           └── channel_online_offline=TYPE/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/
│   ├── client/
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   │   ├── agent/        # AI chat interface
│   │   │   │   ├── analytics/    # Analytics views
│   │   │   │   ├── forecast/     # Forecasting UI
│   │   │   │   ├── inventory/    # Inventory management
│   │   │   │   ├── store/        # Store management
│   │   │   │   ├── product/      # Product management
│   │   │   │   ├── code/         # Code editor components
│   │   │   │   └── ui/           # Reusable UI components (55+)
│   │   │   ├── context/          # React Context providers
│   │   │   ├── repository/       # API client layer
│   │   │   ├── services/         # Business logic
│   │   │   │   └── agentService.ts # AI agent service
│   │   │   ├── pages/            # Page components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── types.ts          # TypeScript definitions
│   │   │   └── App.tsx           # Root component
│   │   └── build/                # Production build
│   ├── server/                   # Express server (optional)
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── api_contract.md               # API specification (850+ lines)
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **Python**: 3.12 or higher
- **PostgreSQL**: 14.x or higher
- **Docker**: 20.x or higher (optional)
- **Redis**: 7.x or higher (optional)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd retail
```

2. **Set up Python virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r app/requirements.txt
```

4. **Configure environment variables**
Create a `.env` file in the `backend` directory:
```bash
# PostgreSQL Configuration
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=retail_db
POSTGRES_PORT=5432
POSTGRES_SERVICE=localhost

# Application Settings
UVICORN_WORKERS=4

# Optional: ClickHouse (for analytics)
# CLICKHOUSE_HOST=localhost
# CLICKHOUSE_PORT=8123
# CLICKHOUSE_USER=default
# CLICKHOUSE_PASSWORD=
# CLICKHOUSE_DB=retail_analytics

# Optional: Redis (for caching)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=
# REDIS_DB=0

# Optional: Authentication
# AUTHENTICATION_ENABLED=true
```

5. **Run database migrations**
The application will automatically create tables on startup.

6. **Start the backend server**
```bash
cd app
python main.py
```

The API will be available at `http://localhost:8499`

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment variables**
Create a `.env` file in the `frontend` directory:
```bash
VITE_API_BASE_URL=http://localhost:8499
VITE_APP_PREFIX=retail  # Optional URL prefix
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Docker Setup (Alternative)

1. **Backend with Docker**
```bash
cd backend
docker-compose up -d
```

2. **Frontend with Docker**
```bash
cd frontend
docker-compose up -d
```

### Loading Sample Data

1. **Place CSV files** in the `backend/app/data/` directory following this structure:
```
data/
└── week_start_date=2024-12-01/
    └── family=ELECTRONICS/
        └── channel_online_offline=offline/
            └── part-00000.csv
```

2. **Load data via API**
```bash
curl -X POST "http://localhost:8499/core/load-data?clear_existing=true"
```

Or use the web interface once logged in.

## 📚 API Documentation

### Interactive API Docs

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8499/docs`
- **API Contract**: See `api_contract.md` for detailed endpoint specifications

### Key API Endpoints

#### Forecast Management
```
GET  /core/forecast                    # Paginated forecast data with filters
GET  /core/forecast/stats              # Dataset statistics
GET  /core/forecast/filters            # Available filter options
GET  /core/forecast/metrics            # Accuracy metrics (MAE, RMSE, MAPE)
GET  /core/forecast/table-info         # Table schema information
POST /core/load-data                   # Bulk data loading
GET  /core/forecast-table-sql          # Execute custom SQL queries
```

#### Metadata & Configuration
```
GET  /core/forecast-metadata           # Schema metadata and hierarchies
GET  /core/analytics-pages             # Get all analytics configurations
POST /core/analytics-pages             # Create analytics page
PUT  /core/analytics-pages/{id}        # Update analytics page
```

#### Authentication
```
POST /retailstudio/login               # OAuth2 login
POST /retailstudio/verify-token        # Token verification
POST /retailstudio/logout              # User logout
GET  /retailstudio/resources           # Get user permissions
POST /retailstudio/resources           # Update role permissions
```

### Query Parameters & Filtering

The forecast endpoint supports advanced filtering:

**Search**:
```json
{
  "article_id": "12345",
  "store_no": "ST001"
}
```

**Filters**:
```json
{
  "forecast_qty": {
    "type": "range",
    "min": 10,
    "max": 100
  },
  "region": {
    "type": "discrete",
    "values": ["North", "South"]
  }
}
```

**Sorting**:
```json
{
  "field": "forecast_qty",
  "direction": "desc"
}
```

Example request:
```bash
curl -X GET "http://localhost:8499/core/forecast?limit=100&offset=0&week_start_date=2024-12-01&filters=%7B%22region%22%3A%7B%22type%22%3A%22discrete%22%2C%22values%22%3A%5B%22North%22%5D%7D%7D&sort=%7B%22field%22%3A%22forecast_qty%22%2C%22direction%22%3A%22desc%22%7D"
```

## 🗄️ Data Model

### Forecast Table

The main table storing forecast and sales data:

```sql
CREATE TABLE forecast (
    id SERIAL PRIMARY KEY,
    
    -- Store Location Hierarchy
    region VARCHAR,              -- Top level: North, South, etc.
    state VARCHAR,               -- State name
    city VARCHAR,                -- City name
    pin_code VARCHAR,            -- Postal code
    store_no VARCHAR,            -- Unique store identifier
    
    -- Store Attributes
    p1_dc VARCHAR,               -- Distribution center
    format VARCHAR,              -- Store format
    store_type VARCHAR,          -- online/offline
    
    -- Product Category Hierarchy
    vertical VARCHAR,            -- Business vertical
    super_category VARCHAR,      -- Top category level
    division VARCHAR,            -- Division
    segment VARCHAR,             -- Product segment
    brick_description VARCHAR,   -- Sub-category
    class_description VARCHAR,   -- Product class
    
    -- Product Attributes
    article_id VARCHAR,          -- Unique product identifier
    article_description VARCHAR, -- Product name
    brand VARCHAR,               -- Brand name
    segment_code VARCHAR,        -- Segment code
    brick_code VARCHAR,          -- Brick code
    class_code VARCHAR,          -- Class code
    division_code VARCHAR,       -- Division code
    family_code VARCHAR,         -- Family code
    batchno VARCHAR,             -- Batch number
    
    -- Product Characteristics
    kvi VARCHAR,                 -- Key Value Item indicator
    npi VARCHAR,                 -- New Product Introduction indicator
    sd VARCHAR,                  -- Strategic indicator
    
    -- Forecast Data
    forecast_qty FLOAT,          -- ML model forecast
    consensus_qty FLOAT,         -- Baseline forecast
    sold_qty FLOAT,              -- Actual sales
    
    -- Time Dimensions
    week_start_date DATE,        -- Week start date
    month_year VARCHAR,          -- Month and year
    wom INTEGER,                 -- Week of month
    
    -- Status
    status VARCHAR,              -- Record status
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

### Analytics Page Configuration

Stores custom analytics page layouts:

```sql
CREATE TABLE analytics_page_configuration (
    id SERIAL PRIMARY KEY,
    page_name VARCHAR,           -- Unique page name
    attributes JSON,             -- Page metadata
    page_config JSON            -- Layout configuration
);
```

### Data Hierarchies

**Store Location Hierarchy**:
```
Region → State → City → Pin Code → Store Number
```

**Product Category Hierarchy**:
```
Vertical → Super Category → Segment → Article Description → Article ID
```

## 🤖 AI Agent Integration

### Architecture

The AI agent uses Anthropic's Claude to provide natural language analytics:

```typescript
User Query → AgentService → Claude API → SQL Generation → 
Database Query → Result Processing → Visualization
```

### Features

1. **Natural Language Understanding**: Convert questions to SQL
2. **Context Awareness**: Understands data schema and hierarchies
3. **Smart Visualization**: Automatically selects chart types
4. **Error Handling**: Graceful fallbacks for invalid queries
5. **Conversation History**: Multi-turn dialogue support

### Usage Example

```typescript
// Initialize agent service
const agentService = new AgentService(apiKey, metadata);

// Send a query
const response = await agentService.sendMessage(
  "Show me top 5 stores by sales in the North region",
  conversationHistory
);

// Response includes:
// - Natural language explanation
// - SQL query generated
// - Chart configuration
// - Data for visualization
```

### Supported Chart Types

- **Bar Charts**: Category comparisons
- **Line Charts**: Time series trends
- **Pie Charts**: Composition analysis
- **Tables**: Detailed data views
- **Stacked Bar Charts**: Multi-dimensional comparisons

### Configuration

Set your Anthropic API key in the frontend:

```typescript
// In agentService.ts
const ANTHROPIC_API_KEY = 'your-api-key';
```

Or configure via environment variables in production.

## 🎨 Frontend Architecture Deep Dive

### Overview

The frontend is built as a sophisticated multi-panel IDE-style interface with drag-and-drop capabilities, dynamic tab management, and AI-powered analytics. The architecture follows a component-based pattern with React Context for state management.

### 1. Tab Management & Editor Layout System

#### Architecture Pattern: Recursive Split-View Layout

The application uses a **recursive tree-based layout system** that allows users to split the workspace into multiple panels, similar to VS Code or other modern IDEs.

**Core Types** (`types.ts`):
```typescript
// Union type for layout nodes
type LayoutNode = EditorPanelNode | SplitterNode;

// Panel node - contains actual content
interface EditorPanelNode {
  type: 'panel';
  id: string;
  openTabIds: string[];        // IDs of open tabs
  activeTabId: string | null;  // Currently active tab
  contentType: ContentType;    // Type of content being displayed
}

// Splitter node - divides space between two children
interface SplitterNode {
  type: 'splitter';
  id: string;
  orientation: 'horizontal' | 'vertical';
  children: [LayoutNode, LayoutNode];
  splitPercentage: number;     // 0-100, space for first child
}
```

#### Component Hierarchy

```
EditorLayout (Recursive)
├── ContentPanel (Panel Node)
│   ├── TabsContainer
│   │   └── ContentTab (multiple)
│   └── Content Renderers
│       ├── CodeEditor (Monaco)
│       ├── ForecastContent
│       ├── AnalyticsContent
│       ├── StoreTab
│       ├── ProductTab
│       └── ChatMessages
└── Splitter (Splitter Node)
    ├── EditorLayout (child 1)
    └── EditorLayout (child 2)
```

#### How It Works

**1. EditorLayout Component** (`EditorLayout.tsx`):
- **Recursive Renderer**: Traverses the layout tree and renders appropriate components
- **Base Case**: When it encounters a `panel` node, renders `ContentPanel`
- **Recursive Case**: When it encounters a `splitter` node, renders two `EditorLayout` components with a `Splitter` between them

```typescript
const EditorLayout: React.FC<EditorLayoutProps> = ({ layoutNode }) => {
  if (layoutNode.type === 'panel') {
    return <ContentPanel panelNode={layoutNode} />;
  } else if (layoutNode.type === 'splitter') {
    return (
      <div className={`flex ${orientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>
        <div style={firstChildStyle}>
          <EditorLayout layoutNode={children[0]} />
        </div>
        <Splitter orientation={orientation} />
        <div style={secondChildStyle}>
          <EditorLayout layoutNode={children[1]} />
        </div>
      </div>
    );
  }
};
```

**2. ContentPanel Component** (`ContentPanel.tsx`):
- **Tab Management**: Displays tabs via `TabsContainer`
- **Content Rendering**: Renders appropriate content based on active tab type
- **Drag & Drop**: Handles dropping tabs to split panels or move tabs

**Key Features**:
- **9 Content Types**: code, chat, forecast, analytics, store, product, article, inventory, timeline
- **Drag Zones**: Center (move), Bottom, Right (split)
- **Context Awareness**: Each panel knows its active tab and can render appropriate UI

```typescript
const renderContent = () => {
  switch (activeContentType) {
    case 'code':
      return <CodeEditor {...props} />;
    case 'forecast':
      return <ForecastContent forecastType={type} />;
    case 'analytics':
      return <AnalyticsContent analyticsType={type} />;
    case 'store':
      return <StoreTab storeId={activeTabId} />;
    // ... more cases
  }
};
```

**3. TabsContainer Component** (`TabsContainer.tsx`):
- **Tab Rendering**: Displays all open tabs with their icons and titles
- **Tab Reordering**: Drag tabs within the same panel to reorder
- **Tab Splitting**: Drag tabs to other panels or create new panels
- **Visual Feedback**: Highlights drop zones and dragged tabs

**Tab Operations**:
```typescript
// Internal reordering within panel
handleDragStartInternal(index) -> handleDragEnter(index) -> handleDragEndInternal()

// External split to different panel
handleDragStartExternal(tabId) -> ContentPanel.handleDrop() -> splitPanel()
```

#### Drag & Drop System

**Four Drop Modes**:

1. **Center Drop**: Move tab to existing panel
   - Triggers: Drop in center 75% of panel (below tab bar)
   - Action: Moves tab to target panel, removes from source

2. **Right Split**: Create vertical split
   - Triggers: Drop in rightmost 25% of panel
   - Action: Creates new panel to the right with the dropped tab

3. **Bottom Split**: Create horizontal split
   - Triggers: Drop in bottom 25% of panel
   - Action: Creates new panel below with the dropped tab

4. **Tab Reorder**: Reorder within panel
   - Triggers: Drag tab over other tabs in same panel
   - Action: Changes tab order in openTabIds array

**State Management**:
- Layout tree stored in `WorkspaceContext`
- Updates use immutable tree transformations
- Recursive functions update nested nodes

### 2. Analytics Page & Chart Creation System

#### Dynamic Grid-Based Dashboard

The Analytics module provides a **visual dashboard builder** where users can create, position, and configure widgets on a 16-column grid.

**Architecture**: Grid Layout Engine + Widget System

#### Component Structure

```
AnalyticsContent (Main Container)
├── Edit Mode Toggle
├── Grid System (16 cols × dynamic rows)
│   └── Widgets (dynamic positioning)
│       ├── Chart Widgets (Nivo charts)
│       ├── Card Widgets (metrics)
│       ├── Heading Widgets (sections)
│       └── Table Widgets (data grids)
└── Widget Form (configuration)
```

#### Grid System

**Grid Configuration**:
```typescript
const GRID_COLS = 16;        // Fixed columns
const GRID_ROWS = 1000;      // Dynamic rows

interface Widget {
  id: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  title: string;
  widgetType: 'chart' | 'card' | 'heading' | 'table';
  chartType?: 'bar' | 'pie' | 'line' | 'boxplot';
  sqlQuery?: string;
  alignment: 'left' | 'center' | 'right';
}
```

**Grid Calculation**:
```typescript
// Convert mouse position to grid cell
const getGridCellFromPosition = (x: number, y: number) => {
  const rect = gridRef.current.getBoundingClientRect();
  const relativeX = x - rect.left;
  const relativeY = y - rect.top + scrollY;
  
  const col = Math.floor(relativeX / cellWidth);
  const row = Math.floor(relativeY / cellHeight);
  
  return { row: clamp(row, 0, GRID_ROWS - 1), col: clamp(col, 0, GRID_COLS - 1) };
};
```

#### Widget Creation Workflow

**Step 1: Select Grid Area (Edit Mode)**
```
User clicks grid → setSelectedStart({ row, col })
User moves mouse → setHoveredEnd({ row, col })
Visual preview → calculates min/max rows and cols
User releases → showWidgetForm()
```

**Step 2: Configure Widget**
```typescript
interface WidgetFormData {
  title: string;
  description: string;
  widgetType: 'chart' | 'card' | 'heading' | 'table';
  chartType: 'bar' | 'pie' | 'line' | 'boxplot';
  sqlQuery: string;              // SQL query for data
  alignment: 'left' | 'center' | 'right';
  pageSize: number;              // For tables
  enablePagination: boolean;     // For tables
}
```

**Step 3: Data Fetching & Rendering**
```typescript
// Execute SQL query via Analytics Repository
const fetchChartData = async (widget: Widget) => {
  const result = await analyticsRepository.executeSqlQuery(
    widget.sqlQuery,
    { column: value }  // Optional filters
  );
  setChartData(prev => ({ ...prev, [widget.id]: result.data }));
};
```

#### Chart Rendering with Nivo

**Supported Chart Types**:

1. **Bar Charts** (ResponsiveBar):
```typescript
<ResponsiveBar
  data={chartData}
  keys={['value']}
  indexBy="category"
  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
  colors={{ scheme: 'nivo' }}
  axisBottom={{ tickRotation: -45 }}
/>
```

2. **Line Charts** (ResponsiveLine):
```typescript
<ResponsiveLine
  data={[{ id: 'series', data: chartData }]}
  xScale={{ type: 'point' }}
  yScale={{ type: 'linear' }}
  curve="monotoneX"
  enableArea={true}
/>
```

3. **Pie Charts** (ResponsivePie):
```typescript
<ResponsivePie
  data={chartData}
  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
  innerRadius={0.5}  // Donut chart
  padAngle={0.7}
/>
```

4. **Box Plots** (ResponsiveBoxPlot):
```typescript
<ResponsiveBoxPlot
  data={chartData}
  margin={{ top: 60, right: 140, bottom: 60, left: 60 }}
  quantiles={[0.1, 0.25, 0.5, 0.75, 0.9]}
/>
```

#### Widget Manipulation

**Features in Edit Mode**:

1. **Move Widget**: Click and drag widget to new position
2. **Resize Widget**: Drag corners or edges to resize
3. **Edit Configuration**: Click edit icon to modify settings
4. **Delete Widget**: Click X to remove widget

**Resize Handles** (8 directions):
- Corners: NW, NE, SW, SE
- Edges: N, S, E, W

```typescript
const handleMouseDown = (e: React.MouseEvent, widgetId: string, mode: DragMode) => {
  setIsDragging(true);
  setDragMode(mode);
  setSelectedWidget(widgetId);
  
  const widget = widgets.find(w => w.id === widgetId);
  setDragStart({ x: e.clientX, y: e.clientY, widget });
};
```

#### Configuration Persistence

**Save/Load Mechanism**:
```typescript
// Save dashboard configuration
const handleSaveConfiguration = async () => {
  const pageName = getPageName(); // From analyticsType prop
  const config = {
    page_name: pageName,
    page_config: { widgets },
    attributes: { lastModified: new Date().toISOString() }
  };
  
  await analyticsRepository.saveAnalyticsPageConfig(config);
};

// Load on mount
useEffect(() => {
  const loadConfiguration = async () => {
    const config = await analyticsRepository.getAnalyticsPageByName(pageName);
    if (config?.page_config?.widgets) {
      setWidgets(config.page_config.widgets);
    }
  };
  loadConfiguration();
}, [analyticsType]);
```

**Backend API**:
- `GET /core/analytics-pages/name/{pageName}` - Load configuration
- `POST /core/analytics-pages` - Create new configuration
- `PUT /core/analytics-pages/{id}` - Update configuration

#### Dynamic SQL Query Execution

**Query Variables**:
Analytics supports parameterized queries with column filtering:

```sql
-- Example query with filters
SELECT super_category, SUM(forecast_qty) as total_forecast
FROM forecast
WHERE week_start_date = '2024-12-01'
  AND region = :region_filter  -- Dynamic filter
GROUP BY super_category
ORDER BY total_forecast DESC
LIMIT 10
```

**Filter UI**:
```typescript
// Auto-detect required columns from page name
const requiredColumns = parseRequiredColumns(analyticsType);
// Example: "Forecast by $region" → ['region']

// Load filter options
const loadColumnOptions = async (column: string) => {
  const options = await forecastRepository.getFilterOptions(column);
  setColumnFilters(prev => ({
    ...prev,
    [column]: { options, value: null, loading: false }
  }));
};
```

### 3. AI Agent Sidebar System

#### Claude-Powered Business Intelligence Agent

The Agent Panel is a **conversational interface** that uses Anthropic's Claude AI to provide natural language analytics and chart generation.

**Architecture**: Context-Aware Chat + Tool Calling + Visualization

#### Component Structure

```
AgentPanel (Sidebar)
├── Header (Connection Status)
├── Context Management
│   └── ContextChips (dragged content)
├── Messages Area
│   ├── User Messages (with context)
│   ├── Agent Responses (text)
│   └── Tool Call Messages (charts)
│       └── ChartRenderer (dynamic)
└── Input Area
    ├── Context Display
    ├── Example Queries
    └── Send Button
```

#### Key Features

**1. Drag & Drop Context System**

Users can drag tabs from the main workspace into the agent panel to provide context:

```typescript
// Handle drop in AgentPanel
const handleDrop = (e: React.DragEvent) => {
  const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
  
  // Extract tab information
  const tabId = dragData.id || dragData.fileId;
  const tabType = dragData.contentType || dragData.type;
  
  // Get full tab data from workspace
  const tabData = getTabData(tabId);
  
  // Add to context items
  addContextItem({
    id: tabId,
    title: tabData.title,
    type: tabType,
    content: getContentForType(tabType, tabId)
  });
};
```

**Context Types Supported**:
- `code`: File content from code editor
- `forecast`: Forecast analysis data
- `analytics`: Analytics dashboard data
- `store`: Store information
- `product`: Product details
- `inventory`: Inventory data
- `chat`: Conversation history
- `task`: Task information

**2. Context-Aware Message Building**

When sending a message, the agent includes all context:

```typescript
const handleSendMessage = async () => {
  // Build detailed context string
  let contextString = 'Context:\n';
  
  for (const item of contextItems) {
    contextString += `\n--- ${item.title} (${item.type}) ---\n`;
    
    // Get detailed content based on type
    const tabData = getTabData(item.id);
    if (tabData.type === 'code') {
      const fileData = getFileData(item.id);
      contextString += `Content:\n${fileData.content}\n`;
    } else if (tabData.type === 'forecast') {
      contextString += `Content Type: Forecast Analysis\n`;
      contextString += `Description: Demand forecasting and trend analysis data\n`;
    }
    // ... other types
  }
  
  const fullMessage = contextString + userMessage;
  
  // Send to Claude API
  const response = await agentService.sendMessage(fullMessage, conversationHistory);
};
```

**3. AgentService & Claude Integration**

**Service Architecture** (`agentService.ts`):

```typescript
class AgentService {
  private anthropic: Anthropic;
  private metadata: any; // Forecast schema metadata
  
  async sendMessage(conversationHistory: Message[]): Promise<AgentResponse> {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8096,
      system: this.getSystemPrompt(),
      messages: conversationHistory,
      tools: this.getTools()
    });
    
    return {
      content: response.content,
      toolCalls: this.extractToolCalls(response)
    };
  }
  
  private getSystemPrompt(): string {
    return `You are a Business Intelligence Agent for a retail analytics platform.
    
Database Schema:
${JSON.stringify(this.metadata, null, 2)}

Your capabilities:
1. Write SQL queries to analyze retail data
2. Generate charts using the show_chart tool
3. Provide insights on forecasting, sales, inventory, etc.

Always be specific, accurate, and provide actionable insights.`;
  }
  
  private getTools() {
    return [{
      name: 'show_chart',
      description: 'Display a chart or table with data',
      input_schema: {
        type: 'object',
        properties: {
          chart_type: {
            type: 'string',
            enum: ['bar', 'line', 'pie', 'table', 'stacked_bar']
          },
          sql_query: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          chart_config: { type: 'object' }
        }
      }
    }];
  }
}
```

**4. Tool Calling & Chart Rendering**

When Claude wants to show a chart, it uses the `show_chart` tool:

```typescript
// Tool call from Claude
{
  type: 'show_chart',
  chart_type: 'bar',
  sql_query: 'SELECT region, SUM(forecast_qty) as total FROM forecast GROUP BY region',
  title: 'Forecast by Region',
  description: 'Total forecasted quantity grouped by region',
  chart_config: {
    indexBy: 'region',
    keys: ['total'],
    colors: { scheme: 'nivo' }
  }
}
```

**ChartRenderer Component**:
```typescript
export const ChartRenderer: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Execute SQL query
    executeSqlQuery(toolCall.sql_query).then(setData);
  }, [toolCall.sql_query]);
  
  // Render based on chart type
  switch (toolCall.chart_type) {
    case 'bar':
      return <ResponsiveBar data={data} {...toolCall.chart_config} />;
    case 'line':
      return <ResponsiveLine data={data} {...toolCall.chart_config} />;
    case 'pie':
      return <ResponsivePie data={data} {...toolCall.chart_config} />;
    case 'table':
      return <DataTable data={data} />;
  }
};
```

**5. Connection Status Management**

The agent panel monitors API connectivity:

```typescript
const checkConnection = async () => {
  setConnectionStatus('checking');
  try {
    const isConnected = await agentService.testConnection();
    setConnectionStatus(isConnected ? 'connected' : 'no-key');
  } catch (error) {
    setConnectionStatus('error');
    setLastError(error.message);
  }
};
```

**Status States**:
- `checking`: Initial state, testing connection
- `connected`: Ready to use (green indicator)
- `no-key`: API key not configured (orange warning)
- `error`: Connection failed (red error)

**6. Message Context Tracking**

The agent tracks which context was used for each message:

```typescript
// Store context when sending message
const [messageContextMap, setMessageContextMap] = useState<Map<string, ContextItem[]>>(new Map());

// When user sends message
const messageContextItems = [...contextItems];
setNextMessageContext(messageContextItems);
addMessage(userMessage, 'user');

// After message is added
useEffect(() => {
  if (nextMessageContext && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'user') {
      setMessageContextMap(prev => 
        new Map(prev.set(lastMessage.id, nextMessageContext))
      );
    }
  }
}, [messages]);

// Display context chips on user messages
{message.sender === 'user' && messageContextMap.has(message.id) && (
  <div className="flex flex-wrap gap-1 mb-2">
    {messageContextMap.get(message.id)?.map(item => (
      <ContextChip key={item.id} title={item.title} type={item.type} />
    ))}
  </div>
)}
```

**7. Example Queries & Suggestions**

On first use, the agent provides example queries:

```typescript
const exampleQueries = [
  "Show me sales by region",
  "Create a forecast accuracy chart",
  "Top 10 products by sales",
  "Store performance analysis",
  "Brand comparison chart"
];

// Clicking example fills input
<button onClick={() => setInputValue(query)}>
  {query}
</button>
```

#### Integration with Forecast Metadata

The agent has full knowledge of the database schema:

```typescript
// Metadata includes
{
  essential_columns: ['region', 'store_no', 'article_id', ...],
  essential_columns_datatypes: {
    'forecast_qty': 'float',
    'region': 'string',
    ...
  },
  store_location_hierarchy: ['region', 'state', 'city', 'store_no'],
  product_category_hierarchy: ['vertical', 'super_category', 'segment', 'article_id'],
  ...
}
```

This allows Claude to:
- Write correct SQL queries
- Understand data relationships
- Suggest relevant analyses
- Generate appropriate visualizations

### State Management Architecture

**Context Providers**:

1. **WorkspaceProvider**: Tab management, layout tree, file operations
2. **AgentProvider**: Agent panel state, messages, context items
3. **ProjectProvider**: Multi-tenant project selection
4. **AuthProvider**: Authentication state
5. **ThemeProvider**: Dark/light mode

**Data Flow**:
```
User Action → Context Dispatch → State Update → Component Re-render
            ↓
     Persistent Storage (localStorage/API)
```

## 💻 Development

### Running in Development Mode

**Backend** (with auto-reload):
```bash
cd backend/app
uvicorn main:app --reload --host 0.0.0.0 --port 8499
```

**Frontend** (with hot module replacement):
```bash
cd frontend
npm run dev
```

### Code Structure Guidelines

**Backend**:
- `routes.py`: API endpoints grouped by functionality
- `schema.py`: SQLAlchemy models
- `permissions.py`: Authorization logic
- Keep endpoints async for better performance

**Frontend**:
- Components: Single responsibility, reusable
- Context: Global state management
- Repository: API client abstraction
- Services: Business logic

### Adding New Features

1. **New API Endpoint**:
   - Add route in `backend/app/core/routes.py`
   - Define Pydantic models for request/response
   - Add proper error handling
   - Document in `api_contract.md`

2. **New UI Component**:
   - Create in appropriate directory under `components/`
   - Use TypeScript for type safety
   - Follow existing component patterns
   - Use shadcn/ui for consistency

3. **New Database Table**:
   - Add model in `backend/app/schema.py`
   - Application creates tables automatically on startup
   - Update repository classes

### Testing

**Backend**:
```bash
# Add pytest configuration
pytest tests/
```

**Frontend**:
```bash
npm run test
```

### Linting & Formatting

**Backend**:
```bash
black backend/app/
flake8 backend/app/
```

**Frontend**:
```bash
npm run check  # TypeScript type checking
```

## ⚙️ Configuration

### Backend Configuration

All settings are managed via environment variables (`.env` file):

```python
# settings.py
class Settings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_port: str
    postgres_service: str
    uvicorn_workers: str
    
    class Config:
        env_file = ".env"
```

### Frontend Configuration

Configure via `.env` file:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8499

# Optional: URL prefix for routing
VITE_APP_PREFIX=retail

# Anthropic API Key (for AI features)
VITE_ANTHROPIC_API_KEY=your-api-key
```

### Multi-tenant Configuration

The platform supports multiple brands via URL routing:

- `/reliance-digital/*` - Reliance Digital brand
- `/reliance-jewels/*` - Reliance Jewels brand
- `/fashion-and-lifestyle/*` - Fashion & Lifestyle brand

Each brand can have its own:
- Data partitioning
- Custom analytics pages
- Branding and themes

## 🚢 Deployment

### Production Build

**Frontend**:
```bash
cd frontend
npm run build
# Output: frontend/client/build/
```

**Backend**:
```bash
# The backend is already production-ready
# Configure workers in .env:
UVICORN_WORKERS=4
```

### Docker Deployment

1. **Build images**:
```bash
# Backend
cd backend
docker build -t retail-backend:latest .

# Frontend
cd frontend
docker build -t retail-frontend:latest .
```

2. **Run with Docker Compose**:
```bash
docker-compose up -d
```

### Environment Variables for Production

**Backend**:
```bash
POSTGRES_SERVICE=production-postgres-host
POSTGRES_PORT=5432
UVICORN_WORKERS=8
AUTHENTICATION_ENABLED=true
```

**Frontend**:
```bash
VITE_API_BASE_URL=https://api.your-domain.com
```

### Scaling Considerations

1. **Database**:
   - Use connection pooling (configured in `postgres_db.py`)
   - Consider read replicas for analytics queries
   - Partition large tables by week_start_date

2. **Application**:
   - Scale horizontally with multiple workers
   - Use Redis for session storage
   - Implement caching for frequently accessed data

3. **Frontend**:
   - Serve build files from CDN
   - Enable gzip compression
   - Implement lazy loading for routes

### Monitoring

- API metrics via FastAPI's built-in monitoring
- Database performance via PostgreSQL logs
- Application logs via uvicorn
- Frontend errors via browser console

## 📝 API Contract

For detailed API specifications, see `api_contract.md` which includes:

- Complete endpoint documentation (850+ lines)
- Request/response formats
- Authentication requirements
- Query parameters
- Error handling
- Multi-tenant support

Key API sections:
1. Dashboard Statistics (7 endpoints)
2. Store Management (3 endpoints)
3. Product Management (4 endpoints)
4. Forecast Data (3 endpoints)
5. Inventory Management (2 endpoints)
6. Analytics (2 endpoints)
7. Replenishment Planning (2 endpoints)

## 🤝 Contributing

1. Follow the existing code structure
2. Write clear commit messages
3. Add tests for new features
4. Update documentation
5. Ensure type safety (TypeScript/Python type hints)

## 📄 License

[Add your license information here]

## 🔒 Security

- Authentication via OAuth2/OIDC
- JWT token-based authorization
- Role-based access control (RBAC)
- SQL injection prevention
- CORS configuration
- Secure password handling with Passlib

For security issues, please contact the development team.

## 📞 Support

For questions or issues:
- Check the API documentation at `/docs`
- Review the API contract in `api_contract.md`
- Contact the development team

---

**Built with ❤️ for retail operations excellence**

