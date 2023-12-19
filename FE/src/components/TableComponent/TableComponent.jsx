import { Button, Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { Excel } from 'antd-table-saveas-excel';
import {FileExcelOutlined, DeleteOutlined}from '@ant-design/icons'
import { useMemo } from 'react';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', isLoading = false, data:dataSource = [], columns = [], handleDeleteMany } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
      }, [columns])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
        setRowSelectedKeys([]);
    }

    const exportExcel = () => {
        const excel = new Excel();
        excel
          .addSheet("test")
          .addColumns(newColumnExport)
          .addDataSource(dataSource, {
            str2Percent: true
          })
          .saveAs("Excel.xlsx");
    };

    return (
        <div>
           <Loading isLoading={isLoading}>
           {(rowSelectedKeys.length > 0 && handleDeleteMany) && (
                    <Button 
                    style={{borderRadius: '6px', backgroundColor: '#d9534f', color: 'white'}}
                    onClick={handleDeleteAll}
                    >
                    <DeleteOutlined />Xóa tất cả
                    </Button>
            )}
            <Button 
            style={{borderRadius: '6px', backgroundColor: '#1d6f42', color: 'white'}}
            onClick={exportExcel}>
            <FileExcelOutlined />Export Excel</Button>
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
           </Loading>
        </div>
    );
};

export default TableComponent;
