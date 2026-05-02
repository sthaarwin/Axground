"use client";

import React, { useEffect, useRef } from "react";
import { createChart, ColorType, ISeriesApi, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";
import { calculateSMA, calculateAllSMA, calculateAllSMCMarkers } from "@/lib/indicators";

interface CandlestickData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface ChartProps {
    data: CandlestickData[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        upColor?: string;
        downColor?: string;
    };
    showSma?: boolean;
    showSmc?: boolean;
    smcOptions?: {
        fvg?: boolean;
        bos?: boolean;
        orderBlock?: boolean;
        liquidity?: boolean;
    };
}

export function CandlestickChart(props: ChartProps) {
    const {
        data,
        colors: {
            backgroundColor = "transparent",
            textColor = "#a1a1aa", // muted foreground
            upColor = "#10b981", // emerald-500
            downColor = "#ef4444", // red-500
        } = {},
        showSma = false,
        showSmc = false,
        smcOptions = { fvg: true, bos: true, orderBlock: true, liquidity: true },
    } = props;

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const seriesRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            grid: {
                vertLines: { color: "rgba(255, 255, 255, 0.05)" },
                horzLines: { color: "rgba(255, 255, 255, 0.05)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            rightPriceScale: {
                borderColor: "rgba(255, 255, 255, 0.1)",
            },
            timeScale: {
                borderColor: "rgba(255, 255, 255, 0.1)",
            },
        });
        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: upColor,
            downColor: downColor,
            borderVisible: false,
            wickUpColor: upColor,
            wickDownColor: downColor,
        });

        seriesRef.current = candlestickSeries;
        candlestickSeries.setData(data);

        if (showSma && data.length > 0) {
            const smas = calculateAllSMA(data);
            
            if (smas.sma9) {
                const sma9Series = chart.addSeries(LineSeries, {
                    color: "#06b6d4", // cyan
                    lineWidth: 1,
                });
                sma9Series.setData(smas.sma9);
            }
            
            if (smas.sma20) {
                const sma20Series = chart.addSeries(LineSeries, {
                    color: "#3b82f6", // blue
                    lineWidth: 2,
                });
                sma20Series.setData(smas.sma20);
            }
            
            if (smas.sma50) {
                const sma50Series = chart.addSeries(LineSeries, {
                    color: "#f59e0b", // amber
                    lineWidth: 2,
                });
                sma50Series.setData(smas.sma50);
            }
            
            if (smas.sma200) {
                const sma200Series = chart.addSeries(LineSeries, {
                    color: "#ec4899", // pink
                    lineWidth: 2,
                });
                sma200Series.setData(smas.sma200);
            }
        }

        if (showSmc && data.length > 0) {
            const markers = calculateAllSMCMarkers(data, smcOptions);
            createSeriesMarkers(candlestickSeries, markers);
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, textColor, upColor, downColor, showSma, showSmc, smcOptions]);

    return (
        <div className="w-full h-[400px]" ref={chartContainerRef} />
    );
}
