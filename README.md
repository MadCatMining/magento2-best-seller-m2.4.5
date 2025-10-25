# Magento 2 Bestseller Product Widget

A powerful and flexible Magento 2 widget that displays bestselling products on any page. Features both static grid and auto-scrolling carousel modes with full responsive design support.

## Features

### Display Modes
- **Static Grid Layout** - Traditional grid display with responsive columns
- **Auto-Scrolling Carousel** - Modern carousel with smooth transitions and animations

### Carousel Capabilities
- **Configurable Auto-scroll Speed** - Set custom timing for automatic slide transitions
- **Manual Navigation Controls** - Arrow buttons and dot indicators for user control
- **Touch Swipe Support** - Mobile-friendly swipe gestures
- **Responsive Breakpoints** - Adapts products per slide based on screen size
- **Pause on Hover** - Auto-scrolling pauses when users interact with the carousel

### Bestseller Period Selection
Choose from three time periods for bestseller calculation:
- **Daily** - Products that sold best in the last 24 hours
- **Monthly** - Top sellers from the past month (default)
- **Yearly** - Best performers over the past year

### Smart Product Filtering
- Automatically excludes deleted products from display
- Only shows enabled products with proper visibility settings
- Validates product availability before rendering

### Customization Options
- Configure total number of products to display
- Set custom product image dimensions (width/height)
- Adjust products per carousel slide
- Fine-tune autoplay speed in milliseconds

## Requirements

- **Magento Version**: 2.4.x or higher
- **PHP Version**: 7.4, 8.1, 8.2, or 8.3
- **Magento Sales Reports**: Bestseller data must be generated (automatic in standard Magento installations)

## Installation

### Method 1: Composer Installation (Recommended)

1. **Add the repository to your composer.json** (if installing from a private repository):
```bash
composer config repositories.emizentech-bestsellerwidget vcs https://github.com/emizentech/magento2-best-seller/
```

2. **Install the module**:
```bash
composer require emizentech/bestsellerwidget
```

3. **Enable the module**:
```bash
bin/magento module:enable Emizentech_Bestsellerwidget
```

4. **Run setup upgrade**:
```bash
bin/magento setup:upgrade
```

5. **Compile dependency injection** (if in production mode):
```bash
bin/magento setup:di:compile
```

6. **Deploy static content** (if in production mode):
```bash
bin/magento setup:static-content:deploy
```

7. **Flush cache**:
```bash
bin/magento cache:flush
```

### Method 2: Manual Installation

1. **Create the module directory structure**:
```bash
cd /path/to/your/magento2
mkdir -p app/code/Emizentech/Bestsellerwidget
```

2. **Copy all module files** to `app/code/Emizentech/Bestsellerwidget/`

3. **Enable the module**:
```bash
bin/magento module:enable Emizentech_Bestsellerwidget
```

4. **Run setup upgrade**:
```bash
bin/magento setup:upgrade
```

5. **Compile dependency injection** (if in production mode):
```bash
bin/magento setup:di:compile
```

6. **Deploy static content** (if in production mode):
```bash
bin/magento setup:static-content:deploy
```

7. **Flush cache**:
```bash
bin/magento cache:flush
```

## Configuration & Usage

### Adding the Widget to a Page

#### Via Admin Panel (CMS Pages/Blocks)

1. Navigate to **Content > Pages** (or **Content > Blocks**)
2. Select the page/block where you want to add the widget
3. In the content editor, click **Insert Widget**
4. Select **Widget Type**: "Bestseller Product Widget"
5. Configure the widget options (see below)
6. Click **Insert Widget**

#### Via Layout XML

Add the widget to any layout XML file:

```xml
<referenceContainer name="content">
    <block class="Emizentech\Bestsellerwidget\Block\Widget\Bestsellerdproduct" name="bestseller.widget">
        <arguments>
            <argument name="productcount" xsi:type="string">12</argument>
            <argument name="imagewidth" xsi:type="string">200</argument>
            <argument name="imageheight" xsi:type="string">200</argument>
            <argument name="enable_carousel" xsi:type="string">1</argument>
            <argument name="products_per_slide" xsi:type="string">4</argument>
            <argument name="autoplay_speed" xsi:type="string">3000</argument>
            <argument name="period" xsi:type="string">monthly</argument>
        </arguments>
    </block>
</referenceContainer>
```

#### Via Widget Instances

1. Navigate to **Content > Widgets**
2. Click **Add Widget**
3. Select **Type**: "Bestseller Product Widget"
4. Select **Design Theme**: Your active theme
5. Click **Continue**
6. Configure **Storefront Properties**:
   - Widget Title
   - Assign to Store Views
   - Display on: Select where to display (e.g., All Pages, Specific Pages)
7. Configure **Widget Options** (see below)
8. Save the widget

### Widget Configuration Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| **Product Count** | Total number of bestseller products to fetch and display | 10 | 12, 20, 50 |
| **Image Width** | Product image width in pixels | 150 | 200, 250 |
| **Image Height** | Product image height in pixels | 150 | 200, 250 |
| **Enable Carousel Mode** | Switch between grid (No) and carousel (Yes) display | No | Yes/No |
| **Products Per Slide** | Number of products visible per carousel slide (only when carousel enabled) | 4 | 3, 4, 5, 6 |
| **Autoplay Speed (ms)** | Auto-scroll speed in milliseconds (only when carousel enabled) | 3000 | 2000, 5000, 8000 |
| **Bestseller Period** | Time period for bestseller calculation | Monthly | Daily, Monthly, Yearly |

### Configuration Examples

#### Static Grid with 20 Products
```
Product Count: 20
Image Width: 200
Image Height: 200
Enable Carousel Mode: No
Bestseller Period: Monthly
```

#### Carousel with 3 Seconds Auto-scroll
```
Product Count: 15
Image Width: 250
Image Height: 250
Enable Carousel Mode: Yes
Products Per Slide: 4
Autoplay Speed: 3000
Bestseller Period: Yearly
```

#### Daily Bestsellers Carousel (Fast)
```
Product Count: 10
Image Width: 180
Image Height: 180
Enable Carousel Mode: Yes
Products Per Slide: 5
Autoplay Speed: 2000
Bestseller Period: Daily
```

## Responsive Behavior

### Grid Mode
- **Desktop (1024px+)**: Up to 4-5 columns based on configured image size
- **Tablet (768px-1023px)**: 2-3 columns
- **Mobile (<768px)**: 1-2 columns

### Carousel Mode
- **Desktop (1024px+)**: Shows configured products per slide
- **Tablet (768px-1023px)**: Shows minimum of 3 or configured value
- **Small Tablet (480px-767px)**: Shows 2 products per slide
- **Mobile (<480px)**: Shows 1 product per slide

## Customization

### Styling

The widget includes comprehensive CSS classes for customization:

```css
.block-bestseller-products { /* Main container */ }
.block-bestseller-products.grid { /* Grid mode specific */ }
.block-bestseller-products.carousel { /* Carousel mode specific */ }
.product-item-info { /* Individual product container */ }
.carousel-control { /* Arrow buttons */ }
.carousel-dot { /* Dot indicators */ }
```

To override styles, create a custom CSS file in your theme:
```
app/design/frontend/[Vendor]/[Theme]/Emizentech_Bestsellerwidget/web/css/custom.css
```

### Template Customization

To customize the widget template, copy it to your theme:
```
From: app/code/Emizentech/Bestsellerwidget/view/frontend/templates/widget/bestsellerdproduct.phtml
To: app/design/frontend/[Vendor]/[Theme]/Emizentech_Bestsellerwidget/templates/widget/bestsellerdproduct.phtml
```

## Troubleshooting

### No Products Displayed

**Possible causes:**
- No sales data available in the specified period
- Products have been deleted or disabled
- Product visibility settings exclude them from catalog/search
- Bestseller reports not generated

**Solutions:**
1. Check if you have recent sales: `SELECT * FROM sales_bestsellers_aggregated_daily LIMIT 10;`
2. Verify products are enabled: **Catalog > Products**
3. Ensure bestseller aggregation cron is running: `bin/magento cron:run --group index`
4. Try changing the period selection (e.g., from Daily to Monthly)

### Carousel Not Working

**Possible causes:**
- JavaScript errors in browser console
- RequireJS not loading properly
- Static content not deployed

**Solutions:**
1. Check browser console for JavaScript errors
2. Flush cache: `bin/magento cache:flush`
3. Deploy static content: `bin/magento setup:static-content:deploy`
4. Check if jQuery is loaded on the page

### Styling Issues

**Possible causes:**
- CSS not loaded
- Theme conflicts
- Static content needs deployment

**Solutions:**
1. Verify CSS file is loaded in browser Network tab
2. Deploy static content: `bin/magento setup:static-content:deploy`
3. Flush cache: `bin/magento cache:flush`
4. Check for CSS conflicts with browser inspector

## Performance Considerations

- Widget caches product collections based on Magento's default caching
- Fetches 2x the requested product count to account for deleted products
- Validates products on-the-fly to ensure only available items display
- Uses lazy loading for images to improve page load times

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Commercial License

## Support

For issues, questions, or feature requests, please contact the module maintainer or create an issue in the repository.

## Changelog

### Version 2.0.0
- Complete rewrite for Magento 2.4.x compatibility
- Added PHP 8.1, 8.2, 8.3 support
- Introduced carousel mode with auto-scrolling
- Added period selection (Daily/Monthly/Yearly)
- Implemented smart product filtering for deleted items
- Enhanced responsive design
- Added touch swipe support for mobile
- Improved accessibility with ARIA labels
- Modernized codebase with proper dependency injection

### Version 1.0.0
- Initial release with basic grid display
- Product count and image size configuration
