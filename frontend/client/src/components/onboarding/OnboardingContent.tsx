import React from "react";
import {
  Database,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  FileText,
  Code,
  Table,
  Info,
  ExternalLink,
  Copy,
  Calendar,
  Building2,
  Package,
  Activity,
  DollarSign,
  MapPin,
  Boxes,
  Tag,
  Wifi
} from "lucide-react";

interface OnboardingContentProps {
  itemId: string;
  title: string;
  description?: string;
  required: boolean;
  type: string;
  dependsOn?: string[];
}

const OnboardingContent: React.FC<OnboardingContentProps> = ({ 
  itemId, 
  title, 
  description, 
  required, 
  type, 
  dependsOn 
}) => {

  const getContentByItemId = (id: string) => {
    switch (id) {
      case 'upload-catalog':
        return renderCatalogDataContent();
      case 'upload-site':
        return renderSiteDataContent();
      case 'upload-inventory':
        return renderInventoryDataContent();
      case 'upload-interactions':
        return renderInteractionsDataContent();
      case 'upload-pricing':
        return renderPricingDataContent();
      case 'upload-promotions':
        return renderPromotionsDataContent();
      case 'upload-metadata':
        return renderMetadataContent();
      case 'realtime-catalog':
      case 'realtime-store':
      case 'realtime-interactions':
      case 'realtime-inventory':
      case 'realtime-pricing':
        return renderRealtimeDataContent(id);
      case 'config-site':
      case 'config-catalog':
      case 'config-inventory':
      case 'config-interactions':
      case 'config-pricing':
      case 'config-forecasting':
        return renderConfigurationContent(id);
      default:
        return renderDefaultContent();
    }
  };



  const renderCatalogDataContent = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Catalog Data Schema
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Required</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">product_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Unique product identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">product_sku_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Stock keeping unit identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">pack_info</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Optional</span></td>
                <td className="px-4 py-2">Pack type: box, pack, strip, unit</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">category_hierarchy</td>
                <td className="px-4 py-2">map&lt;string, string&gt;</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Category levels (L0-L5 codes and names)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">attributes</td>
                <td className="px-4 py-2">map&lt;string, string&gt;</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Product attributes (color, design, etc.)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          Sample Category Hierarchy JSON
        </h4>
        <pre className="bg-white p-3 rounded text-xs overflow-x-auto border">
{`{
  "L0_code": "DGT",
  "L0_name": "Digital",
  "L1_code": "MOB", 
  "L1_name": "Mobiles & Tablets",
  "L2_code": "SMP",
  "L2_name": "Smartphones",
  "L3_code": "AND",
  "L3_name": "Android Phones",
  "L4_code": "SAM",
  "L4_name": "Samsung",
  "L5_code": "S23U",
  "L5_name": "Samsung Galaxy S23 Ultra"
}`}
        </pre>
      </div>
    </div>
  );

  const renderInteractionsDataContent = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Interactions Data Schema
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Required</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">interaction_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Unique transaction identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">interaction_type</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">procurement, disbursement, sale, return</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">interaction_source</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Source location (DC, store, supplier, etc.)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">interaction_destination</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Destination location</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">interaction_quantity</td>
                <td className="px-4 py-2">int</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Quantity of items</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">interaction_revenue</td>
                <td className="px-4 py-2">double</td>
                <td className="px-4 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Optional</span></td>
                <td className="px-4 py-2">Revenue amount</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">timestamp</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Transaction timestamp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Procurement Transactions</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Supplier → DC</span>
              <span className="text-gray-600">Purchase order fulfilled</span>
            </div>
            <div className="flex justify-between">
              <span>Supplier → Store</span>
              <span className="text-gray-600">Direct delivery</span>
            </div>
            <div className="flex justify-between">
              <span>Plant → DC</span>
              <span className="text-gray-600">Internal dispatch</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Sale Transactions</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Store → Customer</span>
              <span className="text-gray-600">Regular retail sale</span>
            </div>
            <div className="flex justify-between">
              <span>Online → Customer</span>
              <span className="text-gray-600">E-commerce order</span>
            </div>
            <div className="flex justify-between">
              <span>DC → Customer</span>
              <span className="text-gray-600">Direct B2C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricingDataContent = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Pricing Data Schema
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Required</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">product_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Product identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">product_sku_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">SKU identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">mrp</td>
                <td className="px-4 py-2">double</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Maximum retail price</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">selling_price</td>
                <td className="px-4 py-2">double</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Actual selling price</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">cost_price</td>
                <td className="px-4 py-2">double</td>
                <td className="px-4 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Optional</span></td>
                <td className="px-4 py-2">Cost price (needed for margin analysis)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">site</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Site identifier (online/trends/rilfnl)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">last_update_date</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Date in yyyy-MM-dd format</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Info className="w-4 h-4 text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">Data Partitioning</h4>
        </div>
        <p className="text-blue-800 text-sm">
          Pricing data should be partitioned by date (yyyy-MM-dd) and site for optimal query performance.
        </p>
      </div>
    </div>
  );

  const renderSiteDataContent = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Site Data Schema
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Required</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">site_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Unique site identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">site_name</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Site display name</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">location_attributes</td>
                <td className="px-4 py-2">map&lt;string, string&gt;</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">City, state, region, zone, coordinates</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">operational_attributes</td>
                <td className="px-4 py-2">map&lt;string, string&gt;</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Site type, format, status, capabilities</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          Sample Operational Attributes JSON
        </h4>
        <pre className="bg-white p-3 rounded text-xs overflow-x-auto border">
{`{
  "site_type": "store",
  "site_format": "store-in-store", 
  "site_area_sqft": 2500.0,
  "site_opening_date": "2017-06-15",
  "site_status": "active",
  "primary_DC": "M100",
  "omnichannel_enabled": "yes",
  "fulfillment_type": "ship_from_site"
}`}
        </pre>
      </div>
    </div>
  );

  const renderInventoryDataContent = () => (
    <div className="space-y-6">
    

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Inventory Data Schema
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Required</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">product_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Product identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">product_sku_id</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">SKU identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">date</td>
                <td className="px-4 py-2">date</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Date in yyyy-MM-dd format</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">site</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Site identifier</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">available_stock_qty</td>
                <td className="px-4 py-2">int</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Currently available quantity</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">min_stock_qty</td>
                <td className="px-4 py-2">int</td>
                <td className="px-4 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Optional</span></td>
                <td className="px-4 py-2">Minimum stock threshold</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">transit_qty</td>
                <td className="px-4 py-2">int</td>
                <td className="px-4 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Optional</span></td>
                <td className="px-4 py-2">Inventory in transit</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">reserved_qty</td>
                <td className="px-4 py-2">int</td>
                <td className="px-4 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Optional</span></td>
                <td className="px-4 py-2">Reserved/allocated quantity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPromotionsDataContent = () => (
    <div className="space-y-6">
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-4 h-4 text-gray-600 mr-2" />
          <h4 className="font-semibold text-gray-800">Optional Data Type</h4>
        </div>
        <p className="text-gray-700 text-sm">
          Promotions data is optional but recommended for better forecasting accuracy during promotional periods.
        </p>
      </div>
    </div>
  );

  const renderMetadataContent = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            Metadata Schema
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Required</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">key</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Attribute name (e.g., "color")</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">type</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Data type (string, int, double, boolean)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">description</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Attribute description</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">source</td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Source data type (e.g., "catalog data")</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">can_search</td>
                <td className="px-4 py-2">boolean</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Enable search functionality</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-blue-600">can_filter</td>
                <td className="px-4 py-2">boolean</td>
                <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Required</span></td>
                <td className="px-4 py-2">Enable filtering</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRealtimeDataContent = (id: string) => (
    <div className="space-y-6">
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Info className="w-4 h-4 text-gray-600 mr-2" />
          <h4 className="font-semibold text-gray-800">Optional but Recommended</h4>
        </div>
        <p className="text-gray-700 text-sm">
          Real-time data connections are optional but provide significant benefits for accurate forecasting and inventory management.
        </p>
      </div>
    </div>
  );

  const renderConfigurationContent = (id: string) => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
          <h4 className="font-semibold text-yellow-800">Depends on Data Upload</h4>
        </div>
        <p className="text-yellow-700 text-sm">
          Configuration steps become available after completing the corresponding data upload steps.
        </p>
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <FileText className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Setup Instructions</h3>
        </div>
        <p className="text-gray-800">
          Detailed setup instructions for this step will be displayed here.
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[hsl(var(--panel-background))] flex flex-col">
      {/* Header */}
      <div className="flex-none p-6 border-b border-[hsl(var(--panel-border))]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold text-[hsl(var(--panel-foreground))]">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            {required && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                Required
              </span>
            )}
            {!required && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Optional
              </span>
            )}
          </div>
        </div>
        {description && (
          <p className="text-[hsl(var(--panel-muted-foreground))] text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {getContentByItemId(itemId)}
      </div>
    </div>
  );
};

export default OnboardingContent; 