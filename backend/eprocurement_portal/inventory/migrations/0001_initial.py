# Generated by Django 4.2.20 on 2025-04-24 05:37

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subcategories', to='inventory.category')),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='InventoryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('sku', models.CharField(max_length=50, unique=True)),
                ('description', models.TextField()),
                ('unit_of_measure', models.CharField(max_length=50)),
                ('current_quantity', models.PositiveIntegerField(default=0)),
                ('minimum_quantity', models.PositiveIntegerField(default=0)),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('location', models.CharField(blank=True, max_length=255)),
                ('last_ordered_date', models.DateField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='inventory.category')),
            ],
            options={
                'verbose_name': 'Inventory Item',
                'verbose_name_plural': 'Inventory Items',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='InventoryTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_type', models.CharField(choices=[('receipt', 'Receipt'), ('issue', 'Issue'), ('adjustment', 'Adjustment'), ('return', 'Return')], max_length=20)),
                ('quantity', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('previous_quantity', models.PositiveIntegerField()),
                ('new_quantity', models.PositiveIntegerField()),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transaction_date', models.DateTimeField(auto_now_add=True)),
                ('reference', models.CharField(blank=True, help_text='PO number or other reference', max_length=100)),
                ('notes', models.TextField(blank=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory_transactions', to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='inventory.inventoryitem')),
            ],
            options={
                'verbose_name': 'Inventory Transaction',
                'verbose_name_plural': 'Inventory Transactions',
                'ordering': ['-transaction_date'],
            },
        ),
    ]
