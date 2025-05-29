class ReporteView {
    static getTemplate() {
        return `
            <div class="reporte-container">
                <div class="fecha-filter">
                    <h3>Delimite las fechas de su reporte</h3>
                    <div class="fecha-inputs">
                        <div class="fecha-group">
                            <label for="fecha-inicial">Fecha inicial</label>
                            <input type="date" id="fecha-inicial" name="fecha-inicial">
                        </div>
                        <div class="fecha-group">
                            <label for="fecha-final">Fecha final</label>
                            <input type="date" id="fecha-final" name="fecha-final">
                        </div>
                        <div class="fecha-buttons">
                            <button id="btn-actualizar-reporte" class="btn-actualizar">Actualizar</button>
                            <button id="btn-imprimir-reporte" class="btn-imprimir">Imprimir</button>
                        </div>
                    </div>
                </div><div class="reporte-tabs">
                    <button id="tab-reporte-ventas" class="tab-reporte">Ventas</button>
                    <button id="tab-reporte-analisis" class="tab-reporte">Análisis</button>
                </div>
                <div id="reporte-ventas" class="reporte-content" style="display: none;">
                    <table class="reporte-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>DNI</th>
                                <th>Productos</th>
                                <th>Cantidad</th>
                                <th>Monto</th>
                                <th>Método de Pago</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-reporte-ventas">
                            <!-- Datos dinámicos de ventas -->
                        </tbody>
                    </table>
                </div>
                <div id="reporte-analisis" class="reporte-content" style="display: none;">
                    <div class="analisis-container">
                        <div class="analisis-card">
                            <h3>Resumen de Ventas</h3>
                            <div class="analisis-datos">
                                <div class="dato-item">
                                    <span class="dato-label">Total Ventas:</span>
                                    <span id="analisis-total-ventas" class="dato-valor">0</span>
                                </div>
                                <div class="dato-item">
                                    <span class="dato-label">Monto Total:</span>
                                    <span id="analisis-monto-total" class="dato-valor">$0.00</span>
                                </div>
                            </div>
                        </div>                        <div class="analisis-card">
                            <h3>Métodos de Pago</h3>
                            <table class="analisis-table">
                                <thead>
                                    <tr>
                                        <th>Método</th>
                                        <th>Cantidad</th>
                                        <th>Porcentaje</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-metodos-pago">
                                    <!-- Datos dinámicos -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export default ReporteView;
