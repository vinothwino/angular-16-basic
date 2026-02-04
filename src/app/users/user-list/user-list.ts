import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectionOptions,
  CellValueChangedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { ModuleRegistry, themeMaterial } from 'ag-grid-community';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AllCommunityModule } from 'ag-grid-community';
import { AddUserModal } from '../add-user-modal/add-user-modal';

@Component({
  selector: 'app-users',
  imports: [AgGridAngular, AddUserModal],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class Users {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userService = inject(UserService);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly theme = signal(themeMaterial);
  protected readonly isCreateModalOpen = signal(false);
  protected readonly createModalTitle = signal('Create User');

  // Convert Observable to Signal for reactive updates
  protected readonly users = toSignal(this.userService.getUsers$(), { initialValue: [] });

  // Grid API reference
  private gridApi!: GridApi<User>;

  // Selection state
  protected readonly selectedUsers = signal<User[]>([]);
  protected readonly hasSelection = computed(() => this.selectedUsers().length > 0);

  // Column definitions with TypeScript typing
  protected readonly columnDefs: ColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      sortable: true,
      filter: 'agNumberColumnFilter',
      pinned: 'left',
      lockPosition: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 100,
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        useFormatter: true,
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['admin', 'user', 'guest'],
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: true,
      filter: true,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['active', 'inactive'],
      },
      cellRenderer: (params: { value: string }) => {
        const status = params.value;
        const color = status === 'active' ? '#28a745' : '#dc3545';
        return `<span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span>`;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 150,
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString();
      },
    }
  ];

  // Default column definition
  protected readonly defaultColDef: ColDef<User> = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  // Row selection configuration
  protected readonly rowSelection: RowSelectionOptions<User> = {
    mode: 'multiRow',
    checkboxes: true,
  };

  constructor() {
    // Register AG Grid modules only in browser (SSR-safe)
    if (this.isBrowser) {
      ModuleRegistry.registerModules([AllCommunityModule]);
    }

    // Update grid when users change
    effect(() => {
      const usersList = this.users();
      if (this.gridApi && usersList.length > 0) {
        this.gridApi.setGridOption('rowData', usersList);
      }
    });
  }

  protected openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  protected closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  protected createUserHandler(user: unknown): void {
    this.userService.createUser(user as User).subscribe({
      next: () => {
        this.refreshGrid();
        this.closeCreateModal();
      },
      error: (error) => {
        console.error('Error creating user:', error);
      },
    });
  }

  /**
   * Grid ready event handler
   */
  protected onGridReady(params: GridReadyEvent<User>): void {
    this.gridApi = params.api;
    this.gridApi.setGridOption('rowData', this.users());

    // Auto-size columns on first load
    this.gridApi.sizeColumnsToFit();
  }

  /**
   * Handle cell value changes (inline editing)
   */
  protected onCellValueChanged(event: CellValueChangedEvent<User>): void {
    const updatedUser = event.data;
    if (updatedUser && updatedUser.id) {
      this.userService
        .updateUser(updatedUser.id, {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          status: updatedUser.status,
        })
        .subscribe({
          next: () => {
            console.log('User updated successfully:', updatedUser);
          },
          error: (error) => {
            console.error('Error updating user:', error);
            // Revert the change on error
            event.api.applyTransaction({ update: [event.oldValue] });
          },
        });
    }
  }

  /**
   * Handle selection changes
   */
  protected onSelectionChanged(event: SelectionChangedEvent<User>): void {
    const selectedRows = event.api.getSelectedRows();
    this.selectedUsers.set(selectedRows);
  }

  /**
   * Delete selected users
   */
  protected deleteSelectedUsers(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert('Please select at least one user to delete.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} user(s)?`)) {
      return;
    }

    const deletePromises = selectedRows.map((user) =>
      this.userService.deleteUser(user.id).toPromise()
    );

    Promise.all(deletePromises)
      .then(() => {
        this.gridApi.deselectAll();
        this.refreshGrid();
        console.log('Users deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting users:', error);
        alert('Error deleting users. Please try again.');
      });
  }

  /**
   * Refresh grid data
   */
  protected refreshGrid(): void {
    this.userService.getUsers$().subscribe((users) => {
      this.gridApi.setGridOption('rowData', users);
    });
  }

  /**
   * Export data to CSV
   */
  protected exportToCsv(): void {
    this.gridApi.exportDataAsCsv({
      fileName: `users_${new Date().toISOString().split('T')[0]}.csv`,
    });
  }

  protected alert(): void {
    console.log('Alert');
  }
}
